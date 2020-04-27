/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import _ from 'lodash';
import debug from 'debug';
import fs, { Dirent } from 'fs';
import path from 'path';
import Plugin from '../api/Plugin';
import AbstractPluginRepository from './AbstractPluginRepository';
import loadPlugin from './PluginLoader';

/**
 * Implementation of a [[PluginRepository]] which loads modules from a `node_modules` local folder
 * containing Node packages with accompanying `package.json` files.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default class NodeModulesPluginRepository<EP_ID> extends AbstractPluginRepository<EP_ID> {

    private readonly log: debug.Debugger = debug('NodeModulesPluginRepository');

    private readonly searchPaths: string[];

    /**
     * Constructor configures the instance using the optionally specified array of `node_modules` search paths.
     *
     * If the search paths are not specified the default is to search within:
     *
     * * `<process.cwd()>/node_modules`
     * * `<process.config.variables.node_prefix>/lib/node_modules`
     *
     * These search paths are expected to include sub-folder package or `@scope` folders containing sub-folder
     * packages. All such folders will be filtered by scope and package (module) name if specified.
     *
     * Any matching package locations are expected to include a `package.json` file. These files
     * will be loaded and will only be used if they specify `type=module`.
     *
     * The modules will then be loaded and filtered by extension ID if this has been specified.
     *
     * NOTE: If the optional search paths are specified, the default values are replaced.
     *
     * @param searchPaths optional array of search paths.
     */
    public constructor(searchPaths?: string[]) {
        super();
        if (searchPaths) {
            this.searchPaths = searchPaths;
        } else {
            this.searchPaths = [
                path.join(process.cwd(), 'node_modules')
            ];
            if (_.has(process, 'config.variables.node_prefix')) {
                this.searchPaths.push(path.join(process.config.variables.node_prefix, 'lib/node_modules'));
            }
        }
    }

    private filterPaths(promises: Promise<string[]>[], dirents: Dirent[], folderPath: string, isScopedFolder: boolean,
        moduleScope: string | undefined, moduleName: string | undefined): string[] {

        // filter on directory entries
        return dirents.filter((dirent): boolean => dirent.isDirectory())

            // filter out based on scope name
            .filter((dirent): boolean => {
                const folderName = dirent.name;

                // non-scoped folders
                if (!folderName.startsWith('@')) {

                    // should be skipped if scope filtering and not in a scoped folder
                    if (!_.isUndefined(moduleScope) && !isScopedFolder) {
                        return false;
                    }

                    // otherwise we should skip them based on name filtering if defined
                    return _.isUndefined(moduleName) || (folderName === moduleName);
                }

                // scoped folders should be scanned recursively after filtering on module scope
                if (_.isUndefined(moduleScope) || (folderName === moduleScope)) {

                    // We only recurse folders one level
                    if (!isScopedFolder) {
                        this.addSubPathsPromise(promises, path.join(folderPath, folderName), true,
                            undefined, moduleName);
                    }
                }
                // the scope folder itself is always filtered out
                return false;
            })
            // map to paths
            .map((dirent): string => path.join(folderPath, dirent.name));
    }

    private addSubPathsPromise(promises: Promise<string[]>[], folderPath: string, isScopedFolder: boolean,
        moduleScope: string | undefined, moduleName: string | undefined): void {

        const promise = new Promise<Dirent[]>((resolve, reject): void => {

            fs.readdir(folderPath, { withFileTypes: true }, (err, dirents): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(dirents);
                }
            });
        })
            .then((dirents: Dirent[]): string[] => this.filterPaths(promises, dirents, folderPath, isScopedFolder,
                moduleScope, moduleName))
            .catch((err): string[] => {
                this.log(`Discarding error: ${err}`);
                return [];
            });

        promises.push(promise);
    }

    private static async getPackageMetadata(candidatePath: string): Promise<{}> {

        const packageJsonPath = path.join(candidatePath, 'package.json');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new Promise<any>((resolve, reject): void => {

            fs.readFile(packageJsonPath, (err, jsonBuffer): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(jsonBuffer.toString());
                }
            });
        })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((jsonString): any => JSON.parse(jsonString));
    }

    private async* filteredPathGenerator(moduleScope: string | undefined, moduleName: string | undefined):
    AsyncIterable<string> {

        const filteredPathsPromises: Promise<string[]>[] = [];

        for (const searchPath of this.searchPaths) {

            this.addSubPathsPromise(filteredPathsPromises, searchPath, false, moduleScope, moduleName);
        }

        for await (const filteredPaths of filteredPathsPromises) {
            yield* filteredPaths;
        }
    }

    protected async* pluginGenerator(moduleScope: string | undefined, moduleName: string | undefined,
        extensionPointId: EP_ID | undefined): AsyncIterable<[string, Plugin<EP_ID>]> {

        for await (const candidatePath of this.filteredPathGenerator(moduleScope, moduleName)) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const packageMetadata: any = await NodeModulesPluginRepository.getPackageMetadata(candidatePath);

                // check if package is a module
                if (packageMetadata.type === 'module') {

                    const pluginLoadResult = await loadPlugin<EP_ID>(path.join(candidatePath, packageMetadata.main),
                        extensionPointId);

                    if (pluginLoadResult.isValidPlugin && (_.isUndefined(extensionPointId)
                        || pluginLoadResult.isValidExtensionPoint)) {
                        if (!_.isUndefined(pluginLoadResult.instance)) {
                            yield [candidatePath, pluginLoadResult.instance];
                        }
                    }
                }
            } catch (err) {
                this.log(`Discarding error: ${err}`);
            }
        }
    }
}
