/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionDetails from './ExtensionDetails';

/**
 * Interface to be implemented by a [[Plugin]].
 *
 * This should be the default export of a plugin module so that it can be discovered by a [[PluginManager]].
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 * @typeparam P_ID is the type of the Plugin IDs used by this plugin manager instance.
 */
export default interface Plugin<EP_ID, P_ID> {

    /**
     * Returns [[ExtensionDetails]] instances describing all Extensions provided by the plugin.
     *
     * @return an array of [[ExtensionDetails]]
     */
    getExtensionDetails(): ExtensionDetails<EP_ID>[];
}
