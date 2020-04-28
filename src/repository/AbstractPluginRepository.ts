/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import Plugin from '../api/Plugin';
import PluginRepository from './PluginRepository';

/**
 * Base implementation of an abstract [[PluginRepository] which relies on a sub-class implementation of
 * [[pluginGenerator]].
 *
 * A Plugin ID takes the form of a URL to a module entry point.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this plugin manager instance.
 */
export default abstract class AbstractPluginRepository<EP_ID> implements PluginRepository<string, EP_ID> {

    protected abstract pluginGenerator(moduleScope: string | undefined, moduleName: string | undefined,
        extensionPointId: EP_ID | undefined): AsyncIterable<[string, Plugin<EP_ID>]>;

    /**
     * @inheritdoc
     */
    public getAllPlugins(): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(undefined, undefined, undefined);
    }

    /**
     * @inheritdoc
     */
    public getPluginsByExtensionPoint(extensionPointId: EP_ID): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(undefined, undefined, extensionPointId);
    }

    /**
     * @inheritdoc
     */
    public getPluginsByModuleName(moduleName: string, moduleScope?: string): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(moduleScope, moduleName, undefined);
    }

    /**
     * @inheritdoc
     */
    public getPluginsByModuleScope(moduleScope: string): AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(moduleScope, undefined, undefined);
    }

    /**
     * @inheritdoc
     */
    public getPluginsByModuleScopeAndExtensionPoint(moduleScope: string, extensionPointId: EP_ID):
        AsyncIterable<[string, Plugin<EP_ID>]> {
        return this.pluginGenerator(moduleScope, undefined, extensionPointId);
    }
}
