/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionFactory from './ExtensionFactory';

/**
 * Provides details of an Extension implementing an Extension Point.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by the plugin manager instance.
 */
export default interface ExtensionDescriptor<EP_ID> {

    /**
     * The implemented Extension Point ID
     */
    readonly extensionPointId: EP_ID;

    /**
     * Provides an [[ExtensionFactory]] which can be used to create an instance of the Extension Point to which
     * this [[ExtensionDescriptor]] object relates.
     */
    readonly factory: ExtensionFactory;

    /**
     * Optional data provided by the Extension.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly extensionData?: any;
}
