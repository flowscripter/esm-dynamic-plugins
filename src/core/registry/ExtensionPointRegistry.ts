/**
 * @module @flowscripter/esm-dynamic-plugins-core
 */

/**
 * A registry of Extension Point IDs.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used in this registry.
 */
export default interface ExtensionPointRegistry<EP_ID> {

    /**
     * Register a specified Extension Point ID.
     *
     * @param extensionPointId the Extension Point ID to register
     */
    register(extensionPointId: EP_ID): void;

    /**
     * Return all registered extension points.
     *
     * @return iterable of EP_ID values
     */
    getAll(): Iterable<EP_ID>;

    /**
     * Returns *true* if the specified Extension Point ID has been registered.
     *
     * @param extensionPointId the Extension Point ID to check
     */
    isRegistered(extensionPointId: EP_ID): boolean;
}
