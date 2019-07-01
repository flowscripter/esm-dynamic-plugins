/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionDetails from '../api/ExtensionDetails';
import ExtensionRegistry from './ExtensionRegistry';

/**
 * Simple implementation of an [[ExtensionRegistry]] using an in-memory map.
 *
 * @typeparam P_ID is the type of the Plugin IDs used in this [[PluginRegistry]] instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used in this [[PluginRegistry]] instance.
 * @typeparam E_H is the type of the Extension Handles used by this plugin manager instance.
 */
export default class InMemoryExtensionRegistry<P_ID, EP_ID, E_H> implements ExtensionRegistry<P_ID, EP_ID, E_H> {

    private readonly extensionsByHandle: Map<E_H, [E_H, P_ID, ExtensionDetails<EP_ID>]> = new Map();

    private readonly extensionDetailsByExtensionPointId: Map<EP_ID, [E_H, P_ID, ExtensionDetails<EP_ID>][]>
    = new Map();

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Extension Handle has already been registered
     */
    public register(extensionHandle: E_H, pluginId: P_ID, extensionDetails: ExtensionDetails<EP_ID>): void {

        if (this.isRegistered(extensionHandle)) {

            throw new Error(`Extension Handle ${extensionHandle} has already been registered`);
        }
        this.extensionsByHandle.set(extensionHandle, [extensionHandle, pluginId, extensionDetails]);

        let registeredExtensionsDetails = this.extensionDetailsByExtensionPointId
            .get(extensionDetails.getExtensionPointId());

        if (registeredExtensionsDetails === undefined) {
            registeredExtensionsDetails = [];
            this.extensionDetailsByExtensionPointId.set(extensionDetails.getExtensionPointId(),
                registeredExtensionsDetails);
        }
        registeredExtensionsDetails.push([extensionHandle, pluginId, extensionDetails]);
    }

    /**
     * @inheritdoc
     */
    public getAll(): Iterable<[E_H, P_ID, ExtensionDetails<EP_ID>]> {
        return this.extensionsByHandle.values();
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Extension Handle has not been registered
     */
    public get(extensionHandle: E_H): ExtensionDetails<EP_ID> {

        const extensionDetails = this.extensionsByHandle.get(extensionHandle);

        if (!extensionDetails) {
            throw new Error(`Extension Handle ${extensionHandle} is unknown`);
        }
        return extensionDetails[2];
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
    public getExtensions(extensionPointId: EP_ID): Iterable<[E_H, P_ID, ExtensionDetails<EP_ID>]> {
        return this.extensionDetailsByExtensionPointId.get(extensionPointId) || [];
    }
}
