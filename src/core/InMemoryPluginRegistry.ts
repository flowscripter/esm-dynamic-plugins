/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import Plugin from '../api/Plugin';
import PluginRegistry from './PluginRegistry';
import ExtensionDetails from '../api/ExtensionDetails';

/**
 * Simple implementation of a [[PluginRegistry]] using an in-memory map.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used in this [[PluginRegistry]] instance.
 * @typeparam P_ID is the type of the Plugin IDs stored in this [[PluginRegistry]] instance.
 */
export default class InMemoryPluginRegistry<EP_ID, P_ID> implements PluginRegistry<EP_ID, P_ID> {

    private readonly pluginsById: Map<P_ID, Plugin<EP_ID, P_ID>> = new Map();

    private readonly extensionDetailsByExtensionPoint: Map<EP_ID, [ExtensionDetails<EP_ID>, Plugin<EP_ID, P_ID>][]>
    = new Map();

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified plugin ID has already been registered
     */
    public register(pluginId: P_ID, plugin: Plugin<EP_ID, P_ID>): void {

        if (this.isRegistered(pluginId)) {

            throw new Error(`Plugin with ID ${pluginId} already registered`);
        }
        this.pluginsById.set(pluginId, plugin);

        const extensionDetails = plugin.getExtensionDetails();

        extensionDetails.forEach((currentExtensionDetails): void => {

            let registeredExtensionsDetails = this.extensionDetailsByExtensionPoint
                .get(currentExtensionDetails.getExtensionPointId());

            if (registeredExtensionsDetails === undefined) {
                registeredExtensionsDetails = [];
                this.extensionDetailsByExtensionPoint.set(currentExtensionDetails.getExtensionPointId(),
                    registeredExtensionsDetails);
            }
            registeredExtensionsDetails.push([currentExtensionDetails, plugin]);
        });
    }

    /**
     * @inheritdoc
     */
    public getAll(): Iterable<[P_ID, Plugin<EP_ID, P_ID>]> {
        return this.pluginsById.entries();
    }

    /**
     * @inheritdoc
     */
    public isRegistered(pluginId: P_ID): boolean {
        return this.pluginsById.has(pluginId);
    }

    private* makeExtensionDetailsIterator(extensionPoint: EP_ID):
    Iterable<[ExtensionDetails<EP_ID>, Plugin<EP_ID, P_ID>]> {
        // eslint-disable-next-line no-restricted-syntax
        for (const extensionPointTuple of this.extensionDetailsByExtensionPoint.entries()) {
            if (extensionPointTuple[0] === extensionPoint) {
                yield* extensionPointTuple[1];
            }
        }
    }

    /**
     * @inheritdoc
     */
    public getExtensionDetails(extensionPoint: EP_ID): Iterable<[ExtensionDetails<EP_ID>, Plugin<EP_ID, P_ID>]> {
        return this.makeExtensionDetailsIterator(extensionPoint);
    }
}
