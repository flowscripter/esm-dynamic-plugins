/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import Plugin from '../../api/Plugin';

/**
 * A source of plugins
 *
 * @typeparam P_ID is the type of the Plugin IDs used by this plugin repository.
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin repository.
 */
export default interface PluginRepository<P_ID, EP_ID> {

    /**
     * Return all plugins in the repository which provide an Extension for the specified Extension Point.
     *
     * @param extensionPointId the Extension Point ID for which to return Extensions
     *
     * @return an async iterable of [P_ID, [[Plugin]]] tuples for all matching implementations
     */
    getPluginsByExtensionPoint(extensionPointId: EP_ID): AsyncIterable<[P_ID, Plugin<EP_ID>]>;

    /**
     * Returns plugins with the specified matching module name and optional scope.
     *
     * @param moduleName the name by which to filter plugins
     * @param moduleScope the optional scope by which to filter plugins
     *
     * @return an async iterable of [P_ID, [[Plugin]]] tuples for all matching implementations
     */
    getPluginsByModuleName(moduleName: string, moduleScope?: string): AsyncIterable<[P_ID, Plugin<EP_ID>]>;

    /**
     * Returns plugins with the specified matching module scope.
     *
     * @param moduleScope the scope by which to filter plugins, this should be of the form `@myscope`
     *
     * @return an async iterable of [P_ID, [[Plugin]]] tuples for all matching implementations
     */
    getPluginsByModuleScope(moduleScope: string): AsyncIterable<[P_ID, Plugin<EP_ID>]>;

    /**
     * Return all plugins in the repository.
     *
     * @return an async iterable of [P_ID, [[Plugin]]] tuples for all known implementations
     */
    getAllPlugins(): AsyncIterable<[P_ID, Plugin<EP_ID>]>;
}
