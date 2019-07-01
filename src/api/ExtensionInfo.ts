/**
 * @module @flowscripter/esm-dynamic-plugins
 */

/**
 * A named tuple providing information for a particular extension.
 *
 * @typeparam P_ID is the type of the Plugin IDs used by this plugin manager instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 * @typeparam E_H is the type of the Extension Handles used by this plugin manager instance.
 */
export default interface ExtensionInfo<P_ID, E_H> {

    /**
     * Handle provided by a [[PluginManager]] to reference an Extension
     */
    extensionHandle: E_H;

    /**
     * The registered ID of the [[Plugin]] providing the Extension
     */
    pluginId: P_ID;

    /**
     * Optional data provided by the [[ExtensionDetails]] associated with the Extension
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extensionData: any;

    /**
     * Optional data provided by the [[Plugin]] providing the Extension
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pluginData: any;
}
