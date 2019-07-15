/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import Plugin from '../../api/Plugin';
import PluginRepository from './PluginRepository';

/**
 * Implementation of a [[PluginRepository]] for URL accessible modules.
 *
 * @typeparam P_ID is the type of the Plugin IDs used by this plugin manager instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default class UrlPluginRepository<P_ID, EP_ID> implements PluginRepository<P_ID, EP_ID> {
    // TODO: implement and tests

    /**
     * @inheritdoc
     */
    // eslint-disable-next-line class-methods-use-this
    public getAllPlugins(): AsyncIterable<[P_ID, Plugin<EP_ID>]> {
        // @ts-ignore
        return [];
    }

    /**
     * @inheritdoc
     */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    public getPluginsByExtensionPoint(extensionPointId: EP_ID): AsyncIterable<[P_ID, Plugin<EP_ID>]> {
        // @ts-ignore
        return [];
    }

    /**
     * @inheritdoc
     */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    public getPluginsByModuleName(moduleName: string, moduleScope?: string):
    AsyncIterable<[P_ID, Plugin<EP_ID>]> {
        // @ts-ignore
        return [];
    }

    /**
     * @inheritdoc
     */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    public getPluginsByModuleScope(moduleScope: string): AsyncIterable<[P_ID, Plugin<EP_ID>]> {
        // @ts-ignore
        return [];
    }
}
