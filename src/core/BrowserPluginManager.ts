/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import BasePluginManager from './BasePluginManager';


/**
 * Implementation of a [[PluginManager]] for a browser runtime.
 */
export default class BrowserPluginManager extends BasePluginManager<string> {
    // TODO: implement

    // private repository: PluginRepository<string, string>;
    //
    // /**
    //  * Constructor configures the instance using the optionally specified [[PluginRegistry]].
    //  * Defaults to using an [[InMemoryPluginRegistry]].
    //  */
    // public constructor() {
    //     super();
    //
    //     this.registerExtensionPoint(PLUGIN_REPOSITORY_ID);
    //     this.registerPlugin(uuidv4(), new BrowserRuntimePlugin());
    //
    //     const info = Array.from(this.getExtensions(PLUGIN_REPOSITORY_ID))[0];
    //
    //     this.repository = this.instantiate(info.extensionHandle);
    // }
    //
    // private static* makePluginIterator(tuples: Iterable<[string, Plugin<string>]>): Iterable<Plugin<string>> {
    //     for (const tuple of tuples) {
    //         yield tuple[1];
    //     }
    // }
    //
    // public registerPluginsByExtensionPoint(extensionPointId: string): Iterable<Plugin<string>> {
    //     return BrowserPluginManager.makePluginIterator(this.repository.getPluginsByExtensionPoint(extensionPointId));
    // }
    //
    // public registerPluginsByModuleName(moduleName: string, moduleScope?: string): Iterable<Plugin<string>> {
    //     return BrowserPluginManager.makePluginIterator(this.repository.getPluginsByModuleName(moduleName,
    //     moduleScope));
    // }
    //
    // public registerPluginsByModuleScope(moduleScope: string): Iterable<Plugin<string>> {
    //     return BrowserPluginManager.makePluginIterator(this.repository.getPluginsByModuleScope(moduleScope));
    // }
}
