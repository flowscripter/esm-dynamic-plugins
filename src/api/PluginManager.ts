/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionInfo from './ExtensionInfo';
import Plugin from './Plugin';

/**
 * Used by a host application to register [[Plugin]] implementations
 * and to query for and instantiate Extension Points implemented by those plugins.
 *
 * @typeparam P_ID is the type of the Plugin IDs used by this plugin manager instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 * @typeparam E_H is the type of the Extension Handles used by this plugin manager instance.
 */
export default interface PluginManager<P_ID, EP_ID, E_H> {

    /**
     * Registers an Extension Point with the [[PluginManager]].
     *
     * @param extensionPointId the Extension Point to add
     */
    registerExtensionPoint(extensionPointId: EP_ID): void;

    /**
     * Return all registered extension points.
     *
     * @return iterable of EP_ID values
     */
    getRegisteredExtensionPoints(): Iterable<EP_ID>;

    /**
     * Registers a [[Plugin]] with the [[PluginManager]].
     *
     * @param pluginId a unique identifier under which to register the [[Plugin]]
     * @param plugin the [[Plugin]] implementation to register
     */
    registerPlugin(pluginId: P_ID, plugin: Plugin<EP_ID>): void;

    /**
     * Return all registered plugins.
     *
     * @return an iterable of tuples [P_ID, [[Plugin]]] for all registered [[Plugin]] implementations
     */
    getRegisteredPlugins(): Iterable<[P_ID, Plugin<EP_ID>]>;

    /**
     * Gets information of Extensions for the specified Extension Point ID provided by the currently
     * registered [[Plugin]] implementations.
     *
     * @param extensionPointId the Extension Point ID for which to return Extensions
     *
     * @return iterable of [[ExtensionInfo]]
     */
    getExtensions(extensionPointId: EP_ID): Iterable<ExtensionInfo<P_ID, E_H>>;

    /**
     * Instantiate a specified Extension.
     *
     * @param extensionHandle the Extension Handle for the Extension to instantiate
     * @param hostData optional data to be passed in to the Extension via an [[ExtensionFactory.create()]] function.
     *
     * @return an Extension instance
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instantiate(extensionHandle: E_H, hostData?: any): any;
}
