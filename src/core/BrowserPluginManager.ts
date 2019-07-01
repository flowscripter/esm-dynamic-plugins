/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import BasePluginManager from './BasePluginManager';

/**
 * Implementation of a [[PluginManager]] for a browser runtime.
 */
export default class BrowserPluginManager extends BasePluginManager<string, string> {

    /**
     * Constructor configures the instance using the optionally specified [[PluginRegistry]].
     * Defaults to using an [[InMemoryPluginRegistry]].
     */
    // public constructor() {
    //     super();
    //
    //     this.registerPlugin();
    // }

    // private registerPlugin(pluginId: string, plugin: Plugin<string>): void {
    //     super.registerPlugin(pluginId, plugin);
    // }

}
