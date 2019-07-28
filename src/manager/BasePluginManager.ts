/**
 * @module @flowscripter/esm-dynamic-plugins
 */
import _ from 'lodash';
import nanoid from 'nanoid';

import ExtensionPointRegistry from '../registry/ExtensionPointRegistry';
import InMemoryExtensionPointRegistry from '../registry/InMemoryExtensionPointRegistry';
import InMemoryPluginRegistry from '../registry/InMemoryPluginRegistry';
import Plugin from '../api/Plugin';
import PluginManager from '../api/PluginManager';
import PluginRegistry from '../registry/PluginRegistry';
import ExtensionRegistry from '../registry/ExtensionRegistry';
import InMemoryExtensionRegistry from '../registry/InMemoryExtensionRegistry';
import ExtensionInfo from '../api/ExtensionInfo';
import PluginRepository from '../repository/PluginRepository';

/**
 * Default implementation of a [[PluginManager]].
 *
 * Internally, string IDs are used to uniquely identify each registered Plugin and to assign a handle to each
 * registered Extension.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs to be used by this [[PluginManager]] instance.
 */
export default class BasePluginManager<EP_ID> implements PluginManager<EP_ID> {

    private readonly pluginRepository: PluginRepository<string, EP_ID>;

    private readonly pluginRegistry: PluginRegistry<string, EP_ID>;

    private readonly extensionPointRegistry: ExtensionPointRegistry<EP_ID>;

    private readonly extensionRegistry: ExtensionRegistry<string, EP_ID, string>;

    /**
     * Constructor configures the instance using the optionally specified [[PluginRegistry]],
     * [[ExtensionPointRegistry]] and [[ExtensionRegistry]] instances.
     *
     * @param pluginRepository optional [[PluginRepository]] implementation.
     * @param pluginRegistry optional [[PluginRegistry]] implementation. Defaults to using [[InMemoryPluginRegistry]].
     * @param extensionPointRegistry optional [[ExtensionPointRegistry]] implementation. Defaults to using
     * [[InMemoryExtensionPointRegistry]].
     * @param extensionRegistry optional [[ExtensionRegistry]] implementation. Defaults to using
     * [[InMemoryExtensionRegistry]].
     */
    public constructor(pluginRepository: PluginRepository<string, EP_ID>,
        pluginRegistry?: PluginRegistry<string, EP_ID>,
        extensionPointRegistry?: ExtensionPointRegistry<EP_ID>,
        extensionRegistry?: ExtensionRegistry<string, EP_ID, string>) {

        this.pluginRepository = pluginRepository;
        this.pluginRegistry = pluginRegistry || new InMemoryPluginRegistry<string, EP_ID>();
        this.extensionPointRegistry = extensionPointRegistry || new InMemoryExtensionPointRegistry<EP_ID>();
        this.extensionRegistry = extensionRegistry || new InMemoryExtensionRegistry<string, EP_ID, string>();
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

    private registerPlugin(pluginId: string, plugin: Plugin<EP_ID>): void {
        this.pluginRegistry.register(pluginId, plugin);

        plugin.extensionDescriptors.forEach((extensionDescriptor): void => {

            const { extensionPointId } = extensionDescriptor;

            if (this.extensionPointRegistry.isRegistered(extensionPointId)) {
                this.extensionRegistry.register(nanoid(), pluginId, extensionDescriptor);
            }
        });
    }

    private async* makeDiscoveredPluginIterator(tuples: AsyncIterable<[string, Plugin<EP_ID>]>):
    AsyncIterable<Plugin<EP_ID>> {
        for await (const tuple of tuples) {

            if (!this.pluginRegistry.isRegistered(tuple[0])) {
                this.registerPlugin(tuple[0], tuple[1]);
                yield tuple[1];
            }
        }
    }

    // eslint-disable-next-line class-methods-use-this
    private async consumeAsyncIterable(iterable: AsyncIterable<Plugin<EP_ID>>): Promise<number> {
        let i = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const item of iterable) {
            i += 1;
        }
        return i;
    }

    /**
     * @inheritdoc
     */
    public async registerPluginsByExtensionPoint(extensionPointId: EP_ID): Promise<number> {
        return this.consumeAsyncIterable(
            this.makeDiscoveredPluginIterator(
                this.pluginRepository.getPluginsByExtensionPoint(extensionPointId)
            )
        );
    }

    /**
     * @inheritdoc
     */
    public async registerPluginsByModuleName(moduleName: string, moduleScope?: string): Promise<number> {
        return this.consumeAsyncIterable(
            this.makeDiscoveredPluginIterator(
                this.pluginRepository.getPluginsByModuleName(moduleName, moduleScope)
            )
        );
    }

    /**
     * @inheritdoc
     */
    public async registerPluginsByModuleScope(moduleScope: string): Promise<number> {
        return this.consumeAsyncIterable(
            this.makeDiscoveredPluginIterator(
                this.pluginRepository.getPluginsByModuleScope(moduleScope)
            )
        );
    }

    // eslint-disable-next-line class-methods-use-this
    private* makeRegisteredPluginIterator(tuples: Iterable<[string, Plugin<EP_ID>]>):
    Iterable<Plugin<EP_ID>> {
        for (const tuple of tuples) {
            yield tuple[1];
        }
    }

    /**
     * @inheritdoc
     */
    public getRegisteredPlugins(): Iterable<Plugin<EP_ID>> {
        return this.makeRegisteredPluginIterator(this.pluginRegistry.getAll());
    }

    private* makeExtensionIterator(extensionPointId: EP_ID): Iterable<ExtensionInfo> {
        for (const extensionPointTuple of this.extensionRegistry.getExtensions(extensionPointId)) {
            yield {
                extensionHandle: extensionPointTuple[0],
                extensionData: extensionPointTuple[2].extensionData,
                pluginData: this.pluginRegistry.get(extensionPointTuple[1]).pluginData
            };
        }
    }

    /**
     * @inheritdoc
     */
    public getExtensions(extensionPointId: EP_ID): Iterable<ExtensionInfo> {
        return this.makeExtensionIterator(extensionPointId);
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Extension Handle is unknown
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async instantiate(extensionHandle: {}, hostData?: any): Promise<any> {
        if (!_.isString(extensionHandle)) {
            throw new Error(`Extension Handle ${extensionHandle} is not a string value`);
        }
        if (!this.extensionRegistry.isRegistered(extensionHandle)) {
            throw new Error(`Extension Handle ${extensionHandle} is unknown`);
        }

        return this.extensionRegistry.get(extensionHandle).factory.create(hostData);
    }
}
