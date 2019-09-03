import InMemoryPluginRegistry from '../../src/registry/InMemoryPluginRegistry';
import PluginA from '../fixtures/PluginA';
import PluginB from '../fixtures/PluginB';

describe('InMemoryPluginRegistry test', () => {

    test('InMemoryPluginRegistry is instantiable', () => {
        expect(new InMemoryPluginRegistry<string, string>()).toBeInstanceOf(InMemoryPluginRegistry);
    });

    test('Plugin can be registered successfully', () => {
        const pluginId = 'foo';
        const registry = new InMemoryPluginRegistry<string, string>();

        expect(Array.from(registry.getAll())).toHaveLength(0);
        expect(registry.isRegistered(pluginId)).toBe(false);

        registry.register(pluginId, new PluginA());

        expect(Array.from(registry.getAll())).toHaveLength(1);
        expect(registry.isRegistered(pluginId)).toBe(true);
    });

    test('Plugin cannot be re-registered with same ID', () => {
        const pluginId = 'foo';
        const registry = new InMemoryPluginRegistry<string, string>();

        registry.register(pluginId, new PluginA());

        expect(() => {
            registry.register(pluginId, new PluginA());
        }).toThrow();
    });

    test('Plugin can be registered twice with different IDs although this is not recommended', () => {
        const pluginIdA1 = 'foo';
        const pluginIdA2 = 'bar';
        const pluginA = new PluginA();
        const registry = new InMemoryPluginRegistry<string, string>();

        registry.register(pluginIdA1, pluginA);

        expect(Array.from(registry.getAll())).toHaveLength(1);
        expect(registry.isRegistered(pluginIdA1)).toBe(true);

        registry.register(pluginIdA2, pluginA);

        expect(Array.from(registry.getAll())).toHaveLength(2);
        expect(registry.isRegistered(pluginIdA2)).toBe(true);
    });

    test('Two plugins can be registered', () => {
        const pluginIdA = 'foo';
        const pluginIdB = 'bar';
        const pluginA = new PluginA();
        const pluginB = new PluginB();
        const registry = new InMemoryPluginRegistry<string, string>();

        registry.register(pluginIdA, pluginA);

        expect(Array.from(registry.getAll())).toHaveLength(1);
        expect(registry.isRegistered(pluginIdA)).toBe(true);
        expect(registry.isRegistered(pluginIdB)).toBe(false);

        registry.register(pluginIdB, pluginB);

        expect(Array.from(registry.getAll())).toHaveLength(2);
        expect(registry.isRegistered(pluginIdA)).toBe(true);
        expect(registry.isRegistered(pluginIdB)).toBe(true);
    });
});
