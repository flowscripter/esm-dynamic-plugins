/**
 * @module @flowscripter/esm-dynamic-plugins-api
 */

import ExtensionDescriptor from './ExtensionDescriptor';

/**
 * Interface to be implemented by a [[Plugin]].
 *
 * This should be the default export of a plugin module so that it can be discovered by a [[PluginManager]].
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by the plugin manager instance.
 */
export default interface Plugin<EP_ID> {

    /**
     * Array of [[ExtensionDescriptor]] instances describing all Extensions provided by the plugin.
     */
    readonly extensionDescriptors: ExtensionDescriptor<EP_ID>[];

    /**
     * Optional data provided by the Plugin to the host application
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly pluginData?: any;
}
