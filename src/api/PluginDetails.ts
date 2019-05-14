/**
 * @module @flowscripter/esm-dynamic-plugins
 */

/**
 * Provides details of a [[Plugin]] and declares one or more Extensions for one or more Extensions Points
 */
export default interface PluginDetails {

    /**
     * Name of the [[Plugin]]
     *
     * @return name of the [[Plugin]]
     */
    getName(): string;

    /**
     * Scope of the [[Plugin]]
     *
     * @return scope of the [[Plugin]]
     */
    getScope(): string;

    /**
     * Version of the [[Plugin]] - this should conform to the [Semantic Versioning](https://semver.org) specification
     *
     * @return version of the [[Plugin]]
     */
    getVersion(): string;

    /**
     * Returns a map where the keys are Extension Point interfaces and the values are arrays
     * of Extension classes implementing those Extension Points.
     *
     * @return a map of arrays of Extensions by Extension Points implemented by the [[Plugin]]
     */
    getExtensionsByExtensionPoints<EP, E extends EP>(): Map<EP, E[]>;
}
