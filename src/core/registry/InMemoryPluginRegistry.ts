/**
 * @module @flowscripter/esm-dynamic-plugins-core
 */

import Plugin from '../../api/Plugin';
import PluginRegistry from './PluginRegistry';

/**
 * Simple implementation of a [[PluginRegistry]] using an in-memory map.
 *
 * @typeparam P_ID is the type of the Plugin IDs stored in this [[PluginRegistry]] instance.
 * @typeparam EP_ID is the type of the Extension Point IDs used in this [[PluginRegistry]] instance.
 */
export default class InMemoryPluginRegistry<P_ID, EP_ID> implements PluginRegistry<P_ID, EP_ID> {

    private readonly pluginsById: Map<P_ID, Plugin<EP_ID>> = new Map();

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified plugin ID has already been registered
     */
    public register(pluginId: P_ID, plugin: Plugin<EP_ID>): void {

        if (this.isRegistered(pluginId)) {
            throw new Error(`Plugin with ID ${pluginId} already registered`);
        }
        this.pluginsById.set(pluginId, plugin);
    }

    /**
     * @inheritdoc
     */
    public getAll(): Iterable<[P_ID, Plugin<EP_ID>]> {
        return this.pluginsById.entries();
    }

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified Plugin ID has not been registered
     */
    public get(pluginId: P_ID): Plugin<EP_ID> {

        const plugin = this.pluginsById.get(pluginId);

        if (!plugin) {
            throw new Error(`Plugin with ID ${pluginId} has not been registered`);
        }
        return plugin;
    }

    /**
     * @inheritdoc
     */
    public isRegistered(pluginId: P_ID): boolean {
        return this.pluginsById.has(pluginId);
    }
}
