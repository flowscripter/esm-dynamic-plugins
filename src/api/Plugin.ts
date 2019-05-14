/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import PluginDetails from './PluginDetails';

/**
 * Interface to be implemented when developing a [[Plugin]].
 * This should be the default export of a plugin module so that it can be
 * discovered by a [[PluginManager]].
 */
export default interface Plugin {

    /**
     * Details of the [[Plugin]] and declaration of one or more Extensions for one or more Extension Points
     *
     * @return the details for the [[Plugin]]
     */
    getPluginDetails(): PluginDetails;
}
