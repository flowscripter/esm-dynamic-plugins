import * as PluginLoader from '../../../src/core/repository/PluginLoader';
import UrlPluginRepository from '../../../src/core/repository/UrlPluginRepository';
import PluginA from '../../fixtures/PluginA';

jest.mock('../../../src/core/repository/PluginLoader');
const MockedPluginLoader = PluginLoader as jest.Mocked<typeof PluginLoader>;

const moduleUrls = [
    'https://foo.com/@fooscope/foobar',
    'https://foo.com/@fooscope/foofoo',
    'https://foo.com/@fooscope/foo',
    'https://foo.com/@fooscope/bar',
    'https://foo.com/@barscope/barbar',
    'https://foo.com/@barscope/barfoo',
    'https://foo.com/@barscope/foo',
    'https://foo.com/@barscope/bar',
    'https://foo.com/foo',
    'https://foo.com/bar'
];


describe('UrlPluginRepository test', () => {

    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        MockedPluginLoader.loadPlugin.mockImplementation(async (specifier: string, extensionPointId?: unknown):
        Promise<PluginLoader.PluginLoadResult<unknown>> => ({
            isValidPlugin: true,
            isValidExtensionPoint: true,
            instance: new PluginA()
        }));
    });

    it('UrlPluginRepository is instantiable', () => {
        expect(new UrlPluginRepository<string>(['foo'])).toBeInstanceOf(UrlPluginRepository);
    });

    it('Invalid URL throws error', async () => {
        const repository = new UrlPluginRepository<string>(['root']);

        let threw = false;
        try {
            const pluginIds = [];

            for await (const tuple of repository.getAllPlugins()) {
                pluginIds.push(tuple[0]);
            }
        } catch (err) {
            threw = true;
        }
        expect(threw).toBe(true);
    });

    it('Get all plugins works', async () => {
        const repository = new UrlPluginRepository<string>(moduleUrls);

        const pluginIds = [];

        for await (const tuple of repository.getAllPlugins()) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(10);
    });

    it('Get plugins by module scope works', async () => {
        const repository = new UrlPluginRepository<string>(moduleUrls);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleScope('@fooscope')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(4);
    });

    it('Get plugins by module name works', async () => {
        const repository = new UrlPluginRepository<string>(moduleUrls);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleName('bar')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(3);
    });

    it('Get plugins by module name and scope works', async () => {
        const repository = new UrlPluginRepository<string>(moduleUrls);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleName('bar', '@barscope')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(1);
    });
});
