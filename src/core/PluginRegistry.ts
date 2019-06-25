/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import Plugin from '../api/Plugin';
import ExtensionDetails from '../api/ExtensionDetails';

/**
 * Provides a mechanism to register plugins.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used in this registry.
 * @typeparam P_ID is the type of the Plugin IDs stored in this registry.
 */
export default interface PluginRegistry<EP_ID, P_ID> {

    /**
     * Register a specified [[Plugin]] under a specified plugin ID.
     *
     * @param pluginId a unique identifier under which to register the [[Plugin]]
     * @param plugin the [[Plugin]] implementation to register
     */
    register(pluginId: P_ID, plugin: Plugin<EP_ID, P_ID>): void;

    /**
     * Return all registered plugins.
     *
     * @return an iterable of tuples [P_ID, [[Plugin]]] for all registered [[Plugin]] implementations
     */
    getAll(): Iterable<[P_ID, Plugin<EP_ID, P_ID>]>;

    /**
     * Returns *true* if the [[Plugin]] identified by the specified plugin ID has been registered.
     *
     * @param pluginId the plugin ID to check
     */
    isRegistered(pluginId: P_ID): boolean;

    /**
     * Gets all registered [[ExtensionDetails]] and their associated [[Plugin]] modules for the specified
     * Extension Point.
     *
     * @param extensionPointId the Extension Point ID for which to return [[ExtensionDetails]] instances
     *
     * @return iterable of tuples [[[ExtensionDetails]], [[Plugin]]] for the specified Extension Point ID
     */
    getExtensionDetails(extensionPointId: EP_ID): Iterable<[ExtensionDetails<EP_ID>, Plugin<EP_ID, P_ID>]>;
}
