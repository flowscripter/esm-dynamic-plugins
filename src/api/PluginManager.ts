/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import { Class } from './Class';

/**
 * Used by a host application to scan for and register available [[Plugin]] implementations
 * and to query for and instantiate Extension Points implemented by those modules.
 */
export default interface PluginManager {

    /**
     * [[Plugin]] implementations which have been registered via [[registerPlugin]]
     */
    readonly plugins: Plugin[];

    /**
     * Registers a [[Plugin]] with the [[PluginManager]]
     *
     * @param plugin the [[Plugin]] implementation to register
     *
     * @throws *Error* if the specified [[Plugin]] has already been registered
     */
    registerPlugin(plugin: Plugin): void;

    /**
     * Scans for [[Plugin]] implementations and registers any that are discovered via [[registerPlugin]]
     */
    scanForPlugins(): void;

    /**
     * Gets all Extensions for the specified Extension Point provided by the currently
     * registered [[Plugin]] implementations
     *
     * @param ExtensionPoint the Extension Point for which to return Extensions
     *
     * @return array of tuples [Extension, [[Plugin]]] for the specified Extension Point
     */
    getExtensions<EP, E extends EP>(ExtensionPoint: EP): [E, Plugin][];

    /**
     * Instantiate a specified Extension which extends an Extension Point
     *
     * @param Extension the Extension to instantiate
     *
     * @return an Extension Point instance implemented by the specified Extension
     */
    instantiate<EP, E extends EP>(Extension: Class<E>): EP;

// see https://github.com/typescript-eslint/typescript-eslint/issues/123
// eslint-disable-next-line semi
}
