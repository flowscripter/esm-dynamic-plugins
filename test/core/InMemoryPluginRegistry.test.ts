import InMemoryPluginRegistry from '../../src/core/InMemoryPluginRegistry';
import Plugin from '../../src/api/Plugin';
import ExtensionDetails from '../../src/api/ExtensionDetails';
import ExtensionFactory from '../../src/api/ExtensionFactory';

describe('InMemoryPluginRegistry test', () => {

    const EXTENSION_POINT_A = 'ExtensionPointA';

    class ExtensionA {
        // eslint-disable-next-line class-methods-use-this
        public sayHello(): void {
        }
    }

    class ExtensionFactoryA implements ExtensionFactory {
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
        public create(hostData?: any): ExtensionA {
            return new ExtensionA();
        }
    }

    class ExtensionDetailsA implements ExtensionDetails<string> {

        // eslint-disable-next-line class-methods-use-this
        public getExtensionPointId(): string {
            return EXTENSION_POINT_A;
        }

        // eslint-disable-next-line class-methods-use-this
        public getFactory(): ExtensionFactory {
            return new ExtensionFactoryA();
        }
    }

    class PluginA implements Plugin<string, string> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
        public getExtensionDetails(): ExtensionDetails<string>[] {
            return [
                new ExtensionDetailsA()
            ];
        }
    }

    it('InMemoryPluginRegistry is instantiable', () => {
        expect(new InMemoryPluginRegistry<string, string>()).toBeInstanceOf(InMemoryPluginRegistry);
    });

    it('Plugin can be registered successfully', () => {

        const pluginId = 'foo';

        const registry = new InMemoryPluginRegistry<string, string>();

        expect(Array.from(registry.getAll())).toHaveLength(0);

        expect(registry.isRegistered(pluginId)).toBe(false);

        registry.register(pluginId, new PluginA());

        expect(Array.from(registry.getAll())).toHaveLength(1);

        expect(registry.isRegistered(pluginId)).toBe(true);
    });

    it('Plugin cannot be re-registered with same ID', () => {

    });

    it('Plugin cannot be registered twice with different IDs', () => {

    });

    it('Two plugins can be re-registered', () => {

    });

    it('Extension Details can be retrieved', () => {

    });

    it('Extension Details for same Extension Point across two Plugins can be retrieved', () => {

    });

    it('Extension Details for unknown Extension Point cannot be retrieved', () => {

    });
});
