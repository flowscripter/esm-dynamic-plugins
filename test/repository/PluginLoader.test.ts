import loadPlugin from '../../src/repository/PluginLoader';

// NOTE: This function is difficult to test due to its use of dynamic import()

describe('PluginLoader test', () => {

    test('Invalid specifier returns not valid plugin', async () => {
        const result = await loadPlugin('foo');

        expect(result.isValidPlugin).toEqual(false);
        expect(result.isValidExtensionPoint).toEqual(false);
        expect(result.instance).toBeUndefined();
    });
});
