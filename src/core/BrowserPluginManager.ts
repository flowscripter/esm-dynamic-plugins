/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import { Class } from '../api/Class';
import PluginManager from '../api/PluginManager';

/**
 * Used by a browser runtime host application to scan for and register available [[Plugin]] implementations
 * and to query for and instantiate Extension Points implemented by those modules.
 */
export default class BrowserPluginManager implements PluginManager {

    /**
     * @inheritdoc
     */
    public readonly plugins: Plugin[] = [];

    /**
     * @inheritdoc
     */
    public registerPlugin(plugin: Plugin): void { // eslint-disable-line @typescript-eslint/no-unused-vars

        const i = this.plugins.length; // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    /**
     * @inheritdoc
     */
    public scanForPlugins(): void {

        const i = this.plugins.length; // eslint-disable-line @typescript-eslint/no-unused-vars
    }

    /**
     * @inheritdoc
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getExtensions<EP, E extends EP>(ExtensionPoint: EP): [E, Plugin][] {

        const i = this.plugins.length; // eslint-disable-line @typescript-eslint/no-unused-vars
        return [];
    }

    /**
     * @inheritdoc
     */
    public instantiate<EP, E extends EP>(Extension: Class<E>): EP {

        const i = this.plugins.length; // eslint-disable-line @typescript-eslint/no-unused-vars
        return new Extension();
    }

// see https://github.com/typescript-eslint/typescript-eslint/issues/123
// eslint-disable-next-line semi
}
