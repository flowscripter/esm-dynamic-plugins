/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import _ from 'lodash';
import debug from 'debug';
import { Class } from './Class';
import Plugin from '../api/Plugin';

const log: debug.Debugger = debug('loadPlugin');

/**
 * Result of the [[loadPlugin]] function.
 */
export interface PluginLoadResult<EP_ID> {

    /**
     * `true` if the module at the specified location is a valid [[Plugin]] implementation.
     */
    isValidPlugin: boolean;

    /**
     * `true` if [[isValidPlugin]] is `true` AND an extensionPointID was specified and an Extension for this was found.
     */
    isValidExtensionPoint: boolean;

    /**
     * Populated with the instantiated [[Plugin]] instance if [[isValidPlugin]] is `true`
     */
    instance: Plugin<EP_ID> | undefined;
}

/**
 * Utility function to import a specified module and validate it is a [[Plugin]] implementation and
 * optionally that it provides an Extension for the specified Extension Point.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default async function loadPlugin<EP_ID>(specifier: string, extensionPointId?: EP_ID):
Promise<PluginLoadResult<EP_ID>> {

    const result: PluginLoadResult<EP_ID> = {
        isValidPlugin: false,
        isValidExtensionPoint: false,
        instance: undefined
    };

    let module;
    try {
        module = await import(specifier);
    } catch (err) {
        log(`Discarding error: ${err}`);
        return result;
    }

    const potentialClass = module.default;

    // check if default export is a function
    if (!_.isFunction(potentialClass)) {
        return result;
    }

    // assume function is a plugin constructor
    const PotentialPlugin: Class<Plugin<EP_ID>> = potentialClass as unknown as Class<Plugin<EP_ID>>;

    // instantiate assumed plugin
    const potentialPluginInstance: Plugin<EP_ID> = new PotentialPlugin();

    // check the assumed plugin has an array of extension descriptors
    if (!_.isArray(potentialPluginInstance.extensionDescriptors)) {
        return result;
    }

    for (const potentialDescriptor of potentialPluginInstance.extensionDescriptors) {

        // check it is a valid descriptor
        if (_.isUndefined(potentialDescriptor.extensionPointId) || !_.isObject(potentialDescriptor.factory)
            || !_.isFunction(potentialDescriptor.factory.create)) {
            result.isValidPlugin = false;
            result.isValidExtensionPoint = false;
            return result;
        }

        // filter on extension if specified
        if (extensionPointId && _.eq(extensionPointId, potentialDescriptor.extensionPointId)) {
            result.isValidExtensionPoint = true;
        }
    }
    if (result.isValidPlugin) {
        result.instance = potentialPluginInstance;
    }
    return result;
}
