/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionFactory from './ExtensionFactory';

/**
 * Provides details of an Extension implementing an Extension Point referenced by ID.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default interface ExtensionDetails<EP_ID> {

    /**
     * Get the implemented Extension Point ID
     */
    getExtensionPointId(): EP_ID;

    /**
     * Returns optional data provided by the Extension.
     *
     * @return optional data
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getExtensionData(): any;

    /**
     * Returns an [[ExtensionFactory]] which can be used to create an instance of the Extension Point to which
     * this [[ExtensionDetails]] object relates.
     *
     * @return an [[ExtensionFactory]]
     */
    getFactory(): ExtensionFactory;
}
