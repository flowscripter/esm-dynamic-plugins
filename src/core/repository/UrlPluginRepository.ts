/**
 * @module @flowscripter/esm-dynamic-plugins-core
 */

import _ from 'lodash';
import debug from 'debug';
import Plugin from '../../api/Plugin';
import PluginRepository from './PluginRepository';
import { loadPlugin } from './PluginLoader';

/**
 * Implementation of a [[PluginRepository]] for URL accessible modules. The URLs to modules should be of the form:
 *
 * `https://<host>/[@scope/<name>]`
 *
 * e.g.:
 *
 * `https://unpkg.com/@my-scope/my-plugin-module`
 *
 * A Plugin ID takes the form of a URL to a module entry point.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default class UrlPluginRepository<EP_ID> implements PluginRepository<string, EP_ID> {

    private readonly log: debug.Debugger = debug('UrlPluginRepository');

    private readonly moduleUrls: string[];

    /**
     * Constructor configures the instance using the specified array of module URLs.
     *
     * These URLs are filtered by scope and module name if specified. The modules will then be loaded and filtered
     * by extension ID if this has been specified.
     *
     * @param moduleUrls array of module URLs.
     */
    public constructor(moduleUrls: string[]) {
        this.moduleUrls = moduleUrls;
    }

    private* filteredUrlGenerator(moduleScope: string | undefined, moduleName: string | undefined): Iterable<string> {

        for (const moduleUrl of this.moduleUrls) {

            const url = new URL(moduleUrl);

            const path = url.pathname;

            const segments = path.split('/');

            // expect at least one segment i.e. module name
            if (segments.length >= 1) {

                // Filter on name (which is last segment)
                const name = segments[segments.length - 1];

                if (_.isUndefined(moduleName) || (moduleName === name)) {

                    // Filter on scope (which if defined is second last segment)
                    let scope = '';
                    if ((segments.length > 1) && segments[segments.length - 2].startsWith('@')) {
                        scope = segments[segments.length - 2];
                    }
                    if (_.isUndefined(moduleScope) || (moduleScope === scope)) {
                        yield moduleUrl;

                    }
                }
            }
        }
    }

    private async* pluginGenerator(moduleScope: string | undefined, moduleName: string | undefined,
        extensionPointId: EP_ID | undefined): AsyncIterable<[string, Plugin<EP_ID>]> {

        for await (const candidateUrl of this.filteredUrlGenerator(moduleScope, moduleName)) {
            try {

                const pluginLoadResult = await loadPlugin<EP_ID>(candidateUrl, extensionPointId);

                if (pluginLoadResult.isValidPlugin && (_.isUndefined(extensionPointId)
                    || pluginLoadResult.isValidExtensionPoint)) {
                    if (!_.isUndefined(pluginLoadResult.instance)) {
                        yield [candidateUrl, pluginLoadResult.instance];
                    }
                }
            } catch (err) {
                this.log(`Discarding error: ${err}`);
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
