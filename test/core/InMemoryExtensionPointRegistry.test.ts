import InMemoryExtensionPointRegistry from '../../src/core/InMemoryExtensionPointRegistry';

describe('InMemoryExtensionPointRegistry test', () => {

    it('InMemoryExtensionPointRegistry is instantiable', () => {
        expect(new InMemoryExtensionPointRegistry<string>()).toBeInstanceOf(InMemoryExtensionPointRegistry);
    });

    it('Extension Point can be registered successfully', () => {

        const extensionPointId = 'foo';
        const registry = new InMemoryExtensionPointRegistry<string>();

        expect(Array.from(registry.getAll())).toHaveLength(0);
        expect(registry.isRegistered(extensionPointId)).toBe(false);

        registry.register(extensionPointId);

        expect(Array.from(registry.getAll())).toHaveLength(1);
        expect(registry.isRegistered(extensionPointId)).toBe(true);
    });

    it('Extension Point cannot be registered twice', () => {

        const extensionPointId = 'foo';
        const registry = new InMemoryExtensionPointRegistry<string>();

        registry.register(extensionPointId);

        expect(() => {
            registry.register(extensionPointId);
        }).toThrow();
    });

    it('Two extension points can be registered', () => {

        const extensionPointIdA = 'foo';
        const extensionPointIdB = 'bar';
        const registry = new InMemoryExtensionPointRegistry<string>();

        registry.register(extensionPointIdA);

        expect(Array.from(registry.getAll())).toHaveLength(1);
        expect(registry.isRegistered(extensionPointIdA)).toBe(true);
        expect(registry.isRegistered(extensionPointIdB)).toBe(false);

        registry.register(extensionPointIdB);

        expect(Array.from(registry.getAll())).toHaveLength(2);
        expect(registry.isRegistered(extensionPointIdA)).toBe(true);
        expect(registry.isRegistered(extensionPointIdB)).toBe(true);
    });
});
