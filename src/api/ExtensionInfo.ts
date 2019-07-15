/**
 * @module @flowscripter/esm-dynamic-plugins
 */

/**
 * Provides information for a particular Extension which has been registered with a [[PluginManager]].
 */
export default interface ExtensionInfo {

    /**
     * Opaque handle provided by a [[PluginManager]] to reference an Extension
     */
    readonly extensionHandle: {};

    /**
     * Optional data provided by the [[ExtensionDescriptor]] associated with the Extension
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly extensionData?: any;

    /**
     * Optional data provided by the [[Plugin]] providing the Extension
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly pluginData?: any;
}
