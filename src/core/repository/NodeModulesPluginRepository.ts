/**
 * @module @flowscripter/esm-dynamic-plugins-core
 */

import _ from 'lodash';
import fs, { Dirent } from 'fs';
import path from 'path';
import Plugin from '../../api/Plugin';
import PluginRepository from './PluginRepository';
import { Class } from './Class';

/**
 * Implementation of a [[PluginRepository]] which loads modules from a `node_modules` local folder
 * containing Node packages with accompanying `package.json` files.
 *
 * A Plugin ID takes the form of a local filesystem path to a Node package.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default class NodeModulesPluginRepository<EP_ID> implements PluginRepository<string, EP_ID> {

    private readonly searchPaths: string[];

    /**
     * Constructor configures the instance using the optionally specified array of `node_modules` search paths.
     *
     * If the search paths are not specified the default is to search within:
     *
     * * `process.cwd() + node_modules`
     * * `process.config.variables.node_prefix + lib/node_modules`
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
                    return _.isUndefined(moduleName) || folderName.startsWith(moduleName);
                }

                // scoped folders should be scanned recursively after filtering on module scope
                if (_.isUndefined(moduleScope) || folderName.startsWith(moduleScope)) {

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
                moduleScope, moduleName));

        promises.push(promise);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static async getModule(candidatePath: string, packageMetadata: any): Promise<unknown> {

        const modulePath = path.join(candidatePath, packageMetadata.main);

        return import(modulePath);
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

    private async* pluginGenerator(moduleScope: string | undefined, moduleName: string | undefined,
        extensionPointId: EP_ID | undefined): AsyncIterable<[string, Plugin<EP_ID>]> {

        for await (const candidatePath of this.filteredPathGenerator(moduleScope, moduleName)) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const packageMetadata: any = await NodeModulesPluginRepository.getPackageMetadata(candidatePath);

                // check if package is a module
                if (packageMetadata.type === 'module') {

                    const potentialClass: unknown = await NodeModulesPluginRepository.getModule(candidatePath,
                        packageMetadata);

                    // check if default export is a function
                    if (_.isFunction(potentialClass)) {

                        // assume function is a plugin constructor
                        const PotentialPlugin: Class<Plugin<EP_ID>> = potentialClass as unknown as Class<Plugin<EP_ID>>;

                        // instantiate assumed plugin
                        const potentialPluginInstance: Plugin<EP_ID> = new PotentialPlugin();

                        // check the assumed plugin has an array of extension descriptors
                        if (_.isArray(potentialPluginInstance.extensionDescriptors)) {

                            let validPlugin = true;
                            let validExtensionPoint = false;

                            for (const potentialDescriptor of potentialPluginInstance.extensionDescriptors) {

                                // check it is a descriptor
                                if (!_.isUndefined(potentialDescriptor.extensionPointId)
                                    && _.isObject(potentialDescriptor.factory)
                                    && _.isFunction(potentialDescriptor.factory.create)) {

                                    // it is a valid plugim!

                                    // filter on extension if specified
                                    if (extensionPointId
                                        && _.eq(extensionPointId, potentialDescriptor.extensionPointId)) {
                                        validExtensionPoint = true;
                                    }
                                } else {
                                    validPlugin = false;
                                    break;
                                }
                            }
                            if (validPlugin && validExtensionPoint) {
                                yield [candidatePath, potentialPluginInstance];
                            }
                        }
                    }
                }
            } catch (err) {
                // discard error
            }
        }
    }

    /**
     * @inheritdoc
     */
    public getAllPlugins(): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(undefined, undefined, undefined);
    }

    /**
     * @inheritdoc
     */
    public getPluginsByExtensionPoint(extensionPointId: EP_ID): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(undefined, undefined, extensionPointId);
    }

    /**
     * @inheritdoc
     */
    public getPluginsByModuleName(moduleName: string, moduleScope?: string): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(moduleScope, moduleName, undefined);
    }

    /**
     * @inheritdoc
     */
    public getPluginsByModuleScope(moduleScope: string): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(moduleScope, undefined, undefined);
    }
}
