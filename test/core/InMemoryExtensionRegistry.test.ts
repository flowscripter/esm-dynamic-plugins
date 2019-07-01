import InMemoryExtensionRegistry from '../../src/core/InMemoryExtensionRegistry';
import { EXTENSION_POINT_A, EXTENSION_POINT_B } from '../fixtures/ExtensionPoints';
import PluginA from '../fixtures/PluginA';
import PluginB from '../fixtures/PluginB';

describe('InMemoryExtensionRegistry test', () => {

    it('InMemoryExtensionRegistry is instantiable', () => {
        expect(new InMemoryExtensionRegistry<string, string, string>()).toBeInstanceOf(InMemoryExtensionRegistry);
    });

    it('Extension is registered', () => {

        const pluginId = 'foo';
        const extensionHandle = 'handle';
        const pluginA = new PluginA();
        const registry = new InMemoryExtensionRegistry<string, string, string>();

        expect(registry.isRegistered(extensionHandle)).toBeFalsy();

        registry.register(extensionHandle, pluginId, pluginA.extensionDescriptors[0]);

        expect(registry.isRegistered(extensionHandle)).toBeTruthy();
    });

    it('Extension cannot be registered twice', () => {

        const pluginId = 'foo';
        const extensionHandle = 'handle';
        const pluginA = new PluginA();
        const registry = new InMemoryExtensionRegistry<string, string, string>();

        registry.register(extensionHandle, pluginId, pluginA.extensionDescriptors[0]);

        expect(() => {
            registry.register(extensionHandle, pluginId, pluginA.extensionDescriptors[0]);
        }).toThrow();
    });

    it('Unknown extension cannot be retrieved', () => {

        const extensionHandle = 'handle';
        const registry = new InMemoryExtensionRegistry<string, string, string>();

        expect(() => {
            registry.get(extensionHandle);
        }).toThrow();
    });

    it('Extension can be retrieved', () => {

        const pluginId = 'foo';
        const extensionHandle = 'handle';
        const pluginA = new PluginA();
        const registry = new InMemoryExtensionRegistry<string, string, string>();

        expect(Array.from(registry.getExtensions(EXTENSION_POINT_A))).toHaveLength(0);

        registry.register(extensionHandle, pluginId, pluginA.extensionDescriptors[0]);

        expect(Array.from(registry.getExtensions(EXTENSION_POINT_A))).toHaveLength(1);
    });

    it('Extensions for same Extension Point across two Plugins can be retrieved', () => {

        const pluginIdA = 'foo';
        const pluginIdB = 'bar';
        const extensionHandle1 = 'handle1';
        const extensionHandle2 = 'handle2';
        const pluginA = new PluginA();
        const pluginB = new PluginB();
        const registry = new InMemoryExtensionRegistry<string, string, string>();

        registry.register(extensionHandle1, pluginIdA, pluginA.extensionDescriptors[0]);
        registry.register(extensionHandle2, pluginIdB, pluginB.extensionDescriptors[0]);

        expect(Array.from(registry.getExtensions(EXTENSION_POINT_A))).toHaveLength(2);
    });

    it('Extensions for two Extension Points across two Plugins can be retrieved', () => {

        const pluginIdA = 'foo';
        const pluginIdB = 'bar';
        const extensionHandle1 = 'handle1';
        const extensionHandle2 = 'handle2';
        const extensionHandle3 = 'handle3';
        const pluginA = new PluginA();
        const pluginB = new PluginB();
        const registry = new InMemoryExtensionRegistry<string, string, string>();

        registry.register(extensionHandle1, pluginIdA, pluginA.extensionDescriptors[0]);
        registry.register(extensionHandle2, pluginIdB, pluginB.extensionDescriptors[0]);
        registry.register(extensionHandle3, pluginIdB, pluginB.extensionDescriptors[1]);

        expect(Array.from(registry.getExtensions(EXTENSION_POINT_A))).toHaveLength(2);
        expect(Array.from(registry.getExtensions(EXTENSION_POINT_B))).toHaveLength(1);
        expect(Array.from(registry.getAll())).toHaveLength(3);
    });

    it('Extensions for unknown Extension Point returns empty', () => {

        const pluginIdA = 'foo';
        const extensionHandle1 = 'handle1';
        const pluginA = new PluginA();
        const registry = new InMemoryExtensionRegistry<string, string, string>();

        registry.register(extensionHandle1, pluginIdA, pluginA.extensionDescriptors[0]);

        expect(Array.from(registry.getExtensions(EXTENSION_POINT_B))).toHaveLength(0);
    });
});
