/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionDetails from '../api/ExtensionDetails';

/**
 * Provides a mechanism to register extensions.
 *
 * @typeparam P_ID is the type of the Plugin IDs used by this plugin manager instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used in this registry.
 * @typeparam E_H is the type of the Extension Handles used by this plugin manager instance.
 */
export default interface ExtensionRegistry<P_ID, EP_ID, E_H> {

    /**
     * Register a specified [[ExtensionDetails]] under a specified Extension ID.
     *
     * @param extensionHandle a unique identifier under which to register the [[ExtensionDetails]]
     * @param pluginId the ID of the [[Plugin]] providing this Extension implementation
     * @param extensionDetails the [[ExtensionDetails]] implementation to register
     */
    register(extensionHandle: E_H, pluginId: P_ID, extensionDetails: ExtensionDetails<EP_ID>): void;

    /**
     * Return all registered [[ExtensionDetails]] instances.
     *
     * @return an iterable of tuples [E_H, P_ID, [[ExtensionDetails]]] for all registered [[ExtensionDetails]]
     * instances
     */
    getAll(): Iterable<[E_H, P_ID, ExtensionDetails<EP_ID>]>;

    /**
     * Return the specified registered [[ExtensionDetails]] instance.
     *
     * @param extensionHandle the handle for the desired [[ExtensionDetails]] instance
     *
     * @return an [[ExtensionDetails]] instance
     */
    get(extensionHandle: E_H): ExtensionDetails<EP_ID>;

    /**
     * Returns *true* if the [[ExtensionDetails]] identified by the specified Extension Handle has been registered.
     *
     * @param extensionHandle the extension handle to check
     */
    isRegistered(extensionHandle: E_H): boolean;

    /**
     * Return registered Extensions implementing the specified Extension Point.
     *
     * @param extensionPointId the extension ID to match
     *
     * @return an iterable of tuples [E_H, P_ID, [[ExtensionDetails]]] for all matching
     * [[ExtensionDetails]] instances
     */
    getExtensions(extensionPointId: EP_ID): Iterable<[E_H, P_ID, ExtensionDetails<EP_ID>]>;
}
