/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import Plugin from './Plugin';
import ExtensionDetails from './ExtensionDetails';

/**
 * Used by a host application to register [[Plugin]] implementations
 * and to query for and instantiate Extension Points implemented by those plugins.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 * @typeparam P_ID is the type of the Plugin IDs used by this plugin manager instance.
 */
export default interface PluginManager<EP_ID, P_ID> {

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
    registerPlugin(pluginId: P_ID, plugin: Plugin<EP_ID, P_ID>): void;

    /**
     * Return all registered plugins.
     *
     * @return an iterable of tuples [P_ID, [[Plugin]]] for all registered [[Plugin]] implementations
     */
    getRegisteredPlugins(): Iterable<[P_ID, Plugin<EP_ID, P_ID>]>;

    /**
     * Gets all [[ExtensionDetails]] for the specified Extension Point ID provided by the currently
     * registered [[Plugin]] implementations.
     *
     * @param extensionPointId the Extension Point ID for which to return Extensions
     *
     * @return iterable of tuples [[[ExtensionDetails]], [[Plugin]]] for the specified Extension Point
     */
    getExtensions(extensionPointId: EP_ID): Iterable<[ExtensionDetails<EP_ID>, Plugin<EP_ID, P_ID>]>;

    /**
     * Instantiate a specified Extension associated with the specified [[ExtensionDetails]].
     *
     * @param extensionDetails the [[ExtensionDetails]] for the Extension to instantiate
     * @param hostData optional data to be passed in to the Extension via an [[ExtensionFactory.create()]] function.
     *
     * @return an Extension instance implementing the referenced Extension Point
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instantiate(extensionDetails: ExtensionDetails<EP_ID>, hostData?: any): any;
}
