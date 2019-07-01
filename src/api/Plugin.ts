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
 */
export default interface Plugin<EP_ID> {

    /**
     * Returns [[ExtensionDetails]] instances describing all Extensions provided by the plugin.
     *
     * @return an array of [[ExtensionDetails]]
     */
    getExtensionDetails(): ExtensionDetails<EP_ID>[];

    /**
     * Returns optional data provided by the Plugin.
     *
     * @return optional data
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getPluginData(): any;
}
