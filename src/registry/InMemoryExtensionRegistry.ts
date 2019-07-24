/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionDescriptor from '../api/ExtensionDescriptor';
import ExtensionRegistry from './ExtensionRegistry';

/**
 * Simple implementation of an [[ExtensionRegistry]] using an in-memory map.
 *
 * @typeparam P_ID is the type of the Plugin IDs used in this [[PluginRegistry]] instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used in this [[PluginRegistry]] instance.
 * @typeparam E_H is the type of the Extension Handles used in this [[PluginRegistry]] instance.
 */
export default class InMemoryExtensionRegistry<P_ID, EP_ID, E_H> implements ExtensionRegistry<P_ID, EP_ID, E_H> {

    private readonly extensionsByHandle: Map<E_H, [E_H, P_ID, ExtensionDescriptor<EP_ID>]> = new Map();

    private readonly extensionDescriptorsByExtensionPointId: Map<EP_ID, [E_H, P_ID, ExtensionDescriptor<EP_ID>][]>
    = new Map();

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Extension Handle has already been registered
     */
    public register(extensionHandle: E_H, pluginId: P_ID, extensionDescriptor: ExtensionDescriptor<EP_ID>): void {

        if (this.isRegistered(extensionHandle)) {

            throw new Error(`Extension Handle ${extensionHandle} has already been registered`);
        }
        this.extensionsByHandle.set(extensionHandle, [extensionHandle, pluginId, extensionDescriptor]);

        let registeredExtensionsDescriptors = this.extensionDescriptorsByExtensionPointId
            .get(extensionDescriptor.extensionPointId);

        if (registeredExtensionsDescriptors === undefined) {
            registeredExtensionsDescriptors = [];
            this.extensionDescriptorsByExtensionPointId.set(extensionDescriptor.extensionPointId,
                registeredExtensionsDescriptors);
        }
        registeredExtensionsDescriptors.push([extensionHandle, pluginId, extensionDescriptor]);
    }

    /**
     * @inheritdoc
     */
    public getAll(): Iterable<[E_H, P_ID, ExtensionDescriptor<EP_ID>]> {
        return this.extensionsByHandle.values();
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Extension Handle has not been registered
     */
    public get(extensionHandle: E_H): ExtensionDescriptor<EP_ID> {

        const extensionDescriptor = this.extensionsByHandle.get(extensionHandle);

        if (!extensionDescriptor) {
            throw new Error(`Extension Handle ${extensionHandle} is unknown`);
        }
        return extensionDescriptor[2];
    }

    /**
     * @inheritdoc
     */
    public isRegistered(extensionHandle: E_H): boolean {
        return this.extensionsByHandle.has(extensionHandle);
    }

    /**
     * @inheritdoc
     */
    public getExtensions(extensionPointId: EP_ID): Iterable<[E_H, P_ID, ExtensionDescriptor<EP_ID>]> {
        return this.extensionDescriptorsByExtensionPointId.get(extensionPointId) || [];
    }
}
