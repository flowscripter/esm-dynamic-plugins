/**
 * @module @flowscripter/esm-dynamic-plugins-api
 */

import ExtensionInfo from './ExtensionInfo';
import Plugin from './Plugin';

/**
 * Used by a host application to scan for [[Plugin]] implementations
 * and to query for and instantiate Extension Points implemented by those plugins.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default interface PluginManager<EP_ID> {

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
     * Scan for and register plugins which provide an Extension for the specified Extension Point.
     *
     * Any existing registered plugins will be skipped.
     *
     * Any extensions provided by matching plugins which are for unregistered extension points will be skipped.
     *
     * @param extensionPointId the Extension Point ID for which to return Extensions
     *
     * @return a count of newly discovered and registered [[Plugin]] implementations
     */
    registerPluginsByExtensionPoint(extensionPointId: EP_ID): Promise<number>;

    /**
     * Scan for and register plugins with the specified matching module name and optional scope.
     *
     * Any existing registered plugins will be skipped.
     *
     * Any extensions provided by matching plugins which are for unregistered extension points will be skipped.
     *
     * @param moduleName the name by which to filter plugins
     * @param moduleScope the optional scope by which to filter plugins
     *
     * @return a count of newly discovered and registered [[Plugin]] implementations
     */
    registerPluginsByModuleName(moduleName: string, moduleScope?: string): Promise<number>;

    /**
     * Scan for and register plugins with the specified matching module scope.
     *
     * Any existing registered plugins will be skipped.
     *
     * Any extensions provided by matching plugins which are for unregistered extension points will be skipped.
     *
     * @param moduleScope the scope by which to filter plugins
     *
     * @return a count of newly discovered and registered [[Plugin]] implementations
     */
    registerPluginsByModuleScope(moduleScope: string): Promise<number>;

    /**
     * Scan for and register plugins with the specified matching module scope and Extension Point.
     *
     * Any existing registered plugins will be skipped.
     *
     * Any extensions provided by matching plugins which are for unregistered extension points will be skipped.
     *
     * @param moduleScope the scope by which to filter plugins
     * @param extensionPointId the Extension Point ID for which to return Extensions
     *
     * @return a count of newly discovered and registered [[Plugin]] implementations
     */
    registerPluginsByModuleScopeAndExtensionPoint(moduleScope: string, extensionPointId: EP_ID): Promise<number>;

    /**
     * Return all registered plugins.
     *
     * @return an iterable of registered [[Plugin]] implementations
     */
    getRegisteredPlugins(): Iterable<Plugin<EP_ID>>;

    /**
     * Gets information of Extensions for the specified Extension Point provided by the currently
     * registered [[Plugin]] implementations.
     *
     * @param extensionPointId the Extension Point ID for which to return Extensions
     *
     * @return iterable of [[ExtensionInfo]]
     */
    getExtensions(extensionPointId: EP_ID): Iterable<ExtensionInfo>;

    /**
     * Instantiate a specified Extension.
     *
     * @param extensionHandle the opaque handle for the Extension provided by the Plugin Manager instance
     * @param hostData optional data to be passed in to the Extension via an [[ExtensionFactory.create()]] function.
     *
     * @return an Extension instance
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instantiate(extensionHandle: {}, hostData?: any): Promise<any>;
}
