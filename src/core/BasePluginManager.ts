/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionDetails from '../api/ExtensionDetails';
import ExtensionPointRegistry from './ExtensionPointRegistry';
import InMemoryExtensionPointRegistry from './InMemoryExtensionPointRegistry';
import InMemoryPluginRegistry from './InMemoryPluginRegistry';
import Plugin from '../api/Plugin';
import PluginManager from '../api/PluginManager';
import PluginRegistry from './PluginRegistry';

/**
 * Default implementation of a [[PluginManager]].
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used by this [[PluginManager]] instance.
 * @typeparam P_ID is the type of the Plugin IDs used by this [[PluginManager]] instance.
 */
export default class BasePluginManager<EP_ID, P_ID> implements PluginManager<EP_ID, P_ID> {

    private readonly extensionPointRegistry: ExtensionPointRegistry<EP_ID>;

    private readonly pluginRegistry: PluginRegistry<EP_ID, P_ID>;

    /**
     * Constructor configures the instance using the optionally specified [[PluginRegistry]].
     * Defaults to using an [[InMemoryPluginRegistry]].
     */
    public constructor(extensionPointRegistry?: ExtensionPointRegistry<EP_ID>,
        pluginRegistry?: PluginRegistry<EP_ID, P_ID>) {
        this.extensionPointRegistry = extensionPointRegistry || new InMemoryExtensionPointRegistry<EP_ID>();
        this.pluginRegistry = pluginRegistry || new InMemoryPluginRegistry<EP_ID, P_ID>();
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Extension Point ID has already been registered
     */
    public registerExtensionPoint(extensionPointId: EP_ID): void {

        if (this.extensionPointRegistry.isRegistered(extensionPointId)) {
            throw new Error(`Extension Point with ID ${extensionPointId} already registered`);
        }

        this.extensionPointRegistry.register(extensionPointId);
    }

    /**
     * @inheritdoc
     */
    public getRegisteredExtensionPoints(): Iterable<EP_ID> {
        return this.extensionPointRegistry.getAll();
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified [[Plugin]] has already been registered
     */
    public registerPlugin(pluginId: P_ID, plugin: Plugin<EP_ID, P_ID>): void {

        if (this.pluginRegistry.isRegistered(pluginId)) {
            throw new Error(`Plugin with ID ${pluginId} already registered`);
        }

        this.pluginRegistry.register(pluginId, plugin);
    }

    /**
     * @inheritdoc
     */
    public getRegisteredPlugins(): Iterable<[P_ID, Plugin<EP_ID, P_ID>]> {
        return this.pluginRegistry.getAll();
    }

    /**
     * @inheritdoc
     */
    public getExtensions(extensionPoint: EP_ID): Iterable<[ExtensionDetails<EP_ID>, Plugin<EP_ID, P_ID>]> {
        return this.pluginRegistry.getExtensionDetails(extensionPoint);
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the associated [[Plugin]] has not been registered
     */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
    public instantiate(extensionDetails: ExtensionDetails<EP_ID>, hostData?: any): any {
        return extensionDetails.getFactory().create(hostData);
    }
}
