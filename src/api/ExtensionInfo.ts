/**
 * @module @flowscripter/esm-dynamic-plugins
 */

/**
 * Provides information for a particular Extension which has been registered with a [[PluginManager]].
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 * @typeparam E_H is the type of the Extension Handles used by this plugin manager instance.
 */
export default interface ExtensionInfo<P_ID, E_H> {

    /**
     * Handle provided by a [[PluginManager]] to reference an Extension
     */
    readonly extensionHandle: E_H;

    /**
     * The registered ID of the [[Plugin]] providing the Extension
     */
    readonly pluginId: P_ID;

    /**
     * Optional data provided by the [[ExtensionDescriptor]] associated with the Extension
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly extensionData: any;

    /**
     * Optional data provided by the [[Plugin]] providing the Extension
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly pluginData: any;
}
