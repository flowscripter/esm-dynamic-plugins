/**
 * @module @flowscripter/esm-dynamic-plugins
 */

/**
 * A factory interface to instantiate an instance of an Extension implementing an Extension Point.
 */
export default interface ExtensionFactory {

    /**
     * Construct and return an instance of an Extension implementing an Extension Point.
     *
     * @param hostData optional host data to pass into the the Extension constructor.
     *
     * @return an instance of Extension implementing an Extension Point.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create(hostData?: any): any;
}
