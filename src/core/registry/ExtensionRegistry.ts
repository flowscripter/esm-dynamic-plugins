/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionDescriptor from '../../api/ExtensionDescriptor';

/**
 * Provides a mechanism to register extensions.
 *
 * @typeparam P_ID is the type of the Plugin IDs used in this registry.
 * @typeparam EP_ID is the type of the Extension Point IDs used in this registry.
 * @typeparam E_H is the type of the Extension Handles used in this registry.
 */
export default interface ExtensionRegistry<P_ID, EP_ID, E_H> {

    /**
     * Register a specified [[ExtensionDescriptor]] under a specified Extension ID.
     *
     * @param extensionHandle a unique identifier under which to register the [[ExtensionDescriptor]]
     * @param pluginId the ID of the [[Plugin]] providing this Extension
     * @param extensionDescriptor the [[ExtensionDescriptor]] for the Extension to register
     */
    register(extensionHandle: E_H, pluginId: P_ID, extensionDescriptor: ExtensionDescriptor<EP_ID>): void;

    /**
     * Return all registered [[ExtensionDescriptor]] instances.
     *
     * @return an iterable of tuples [E_H, P_ID, [[ExtensionDescriptor]]] for all registered [[ExtensionDescriptor]]
     * instances
     */
    getAll(): Iterable<[E_H, P_ID, ExtensionDescriptor<EP_ID>]>;

    /**
     * Return the specified registered [[ExtensionDescriptor]] instance.
     *
     * @param extensionHandle the handle for the desired [[ExtensionDescriptor]] instance
     *
     * @return an [[ExtensionDescriptor]] instance
     */
    get(extensionHandle: E_H): ExtensionDescriptor<EP_ID>;

    /**
     * Returns *true* if the [[ExtensionDescriptor]] identified by the specified Extension Handle has been registered.
     *
     * @param extensionHandle the extension handle to check
     */
    isRegistered(extensionHandle: E_H): boolean;

    /**
     * Return registered Extensions implementing the specified Extension Point.
     *
     * @param extensionPointId the extension ID to match
     *
     * @return an iterable of tuples [E_H, P_ID, [[ExtensionDescriptor]]] for all matching
     * [[ExtensionDescriptor]] instances
     */
    getExtensions(extensionPointId: EP_ID): Iterable<[E_H, P_ID, ExtensionDescriptor<EP_ID>]>;
}
