/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import Plugin from '../api/Plugin';

/**
 * Provides a mechanism to register plugins.
 *
 * @typeparam P_ID is the type of the Plugin IDs stored in this registry.
 * @typeparam EP_ID is the type of the Extension Point IDs used in this registry.
 */
export default interface PluginRegistry<P_ID, EP_ID> {

    /**
     * Register a specified [[Plugin]] under a specified plugin ID.
     *
     * @param pluginId a unique identifier under which to register the [[Plugin]]
     * @param plugin the [[Plugin]] implementation to register
     */
    register(pluginId: P_ID, plugin: Plugin<EP_ID>): void;

    /**
     * Return all registered plugins.
     *
     * @return an iterable of tuples [P_ID, [[Plugin]]] for all registered [[Plugin]] implementations
     */
    getAll(): Iterable<[P_ID, Plugin<EP_ID>]>;

    /**
     * Return the specified registered [[Plugin]] instance.
     *
     * @param pluginId the ID for the desired [[Plugin]] instance
     *
     * @return a [[Plugin]] instance
     */
    get(pluginId: P_ID): Plugin<EP_ID>;

    /**
     * Returns *true* if the [[Plugin]] identified by the specified plugin ID has been registered.
     *
     * @param pluginId the plugin ID to check
     */
    isRegistered(pluginId: P_ID): boolean;
}
