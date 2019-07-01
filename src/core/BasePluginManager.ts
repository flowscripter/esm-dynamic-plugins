/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import uuidv4 from 'uuidv4';

import ExtensionPointRegistry from './ExtensionPointRegistry';
import InMemoryExtensionPointRegistry from './InMemoryExtensionPointRegistry';
import InMemoryPluginRegistry from './InMemoryPluginRegistry';
import Plugin from '../api/Plugin';
import PluginManager from '../api/PluginManager';
import PluginRegistry from './PluginRegistry';
import ExtensionRegistry from './ExtensionRegistry';
import InMemoryExtensionRegistry from './InMemoryExtensionRegistry';
import ExtensionInfo from '../api/ExtensionInfo';

/**
 * Default implementation of a [[PluginManager]].
 *
 * @typeparam P_ID is the type of the Plugin IDs used by this [[PluginManager]] instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used by this [[PluginManager]] instance.
 */
export default class BasePluginManager<P_ID, EP_ID> implements PluginManager<P_ID, EP_ID, string> {

    private readonly pluginRegistry: PluginRegistry<P_ID, EP_ID>;

    private readonly extensionPointRegistry: ExtensionPointRegistry<EP_ID>;

    private readonly extensionRegistry: ExtensionRegistry<P_ID, EP_ID, string>;

    /**
     * Constructor configures the instance using the optionally specified [[PluginRegistry]].
     * Defaults to using an [[InMemoryPluginRegistry]].
     *
     * @param pluginRegistry optional [[PluginRegistry]] implementation. Defaults to using [[InMemoryPluginRegistry]].
     * @param extensionPointRegistry optional [[ExtensionPointRegistry]] implementation. Defaults to using
     * [[InMemoryExtensionPointRegistry]].
     * @param extensionRegistry optional [[ExtensionRegistry]] implementation. Defaults to using
     * [[InMemoryExtensionRegistry]].
     */
    public constructor(pluginRegistry?: PluginRegistry<P_ID, EP_ID>,
        extensionPointRegistry?: ExtensionPointRegistry<EP_ID>,
        extensionRegistry?: ExtensionRegistry<P_ID, EP_ID, string>) {
        this.pluginRegistry = pluginRegistry || new InMemoryPluginRegistry<P_ID, EP_ID>();
        this.extensionPointRegistry = extensionPointRegistry || new InMemoryExtensionPointRegistry<EP_ID>();
        this.extensionRegistry = extensionRegistry || new InMemoryExtensionRegistry<P_ID, EP_ID, string>();
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
    public registerPlugin(pluginId: P_ID, plugin: Plugin<EP_ID>): void {

        if (this.pluginRegistry.isRegistered(pluginId)) {
            throw new Error(`Plugin with ID ${pluginId} already registered`);
        }

        this.pluginRegistry.register(pluginId, plugin);

        const extensionDetails = plugin.getExtensionDetails();

        extensionDetails.forEach((currentExtensionDetails): void => {

            const extensionHandle: string = uuidv4();

            const extensionPointId: EP_ID = currentExtensionDetails.getExtensionPointId();

            if (!this.extensionPointRegistry.isRegistered(extensionPointId)) {
                throw new Error(`ExtensionPoint ID ${extensionPointId} referenced in plugin has not been registered`);
            }

            this.extensionRegistry.register(extensionHandle, pluginId, currentExtensionDetails);
        });
    }

    /**
     * @inheritdoc
     */
    public getRegisteredPlugins(): Iterable<[P_ID, Plugin<EP_ID>]> {
        return this.pluginRegistry.getAll();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private* makeExtensionIterator(extensionPointId: EP_ID): Iterable<ExtensionInfo<P_ID, string>> {
        // eslint-disable-next-line no-restricted-syntax
        for (const extensionPointTuple of this.extensionRegistry.getExtensions(extensionPointId)) {
            yield {
                extensionHandle: extensionPointTuple[0],
                pluginId: extensionPointTuple[1],
                extensionData: extensionPointTuple[2].getExtensionData(),
                pluginData: this.pluginRegistry.get(extensionPointTuple[1]).getPluginData()
            };
        }
    }

    /**
     * @inheritdoc
     */
    public getExtensions(extensionPointId: EP_ID): Iterable<ExtensionInfo<P_ID, string>> {
        return this.makeExtensionIterator(extensionPointId);
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Extension Handle is unknown
     */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
    public instantiate(extensionHandle: string, hostData?: any): any {

        if (!this.extensionRegistry.isRegistered(extensionHandle)) {
            throw new Error(`Extension Handle ${extensionHandle} is unknown`);
        }

        return this.extensionRegistry.get(extensionHandle).getFactory().create(hostData);
    }
}
