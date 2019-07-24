import fs, { Dirent, PathLike } from 'fs';
import NodeModulesPluginRepository from '../../src/repository/NodeModulesPluginRepository';
import * as PluginLoader from '../../src/repository/PluginLoader';
import PluginA from '../fixtures/PluginA';

jest.mock('../../src/repository/PluginLoader');
const MockedPluginLoader = PluginLoader as jest.Mocked<typeof PluginLoader>;

jest.mock('fs');
const mockedFs = fs as jest.Mocked<typeof fs>;

class MockDirent extends Dirent {

    private readonly isFolder: boolean;

    public constructor(name: string, isFolder: boolean) {
        super();
        this.name = name;
        this.isFolder = isFolder;
    }

    public isFile(): boolean {
        return !this.isFolder;
    }

    public isDirectory(): boolean {
        return this.isFolder;
    }
}

describe('NodeModulesPluginRepository test', () => {

    beforeAll(() => {

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        MockedPluginLoader.loadPlugin.mockImplementation(async (specifier: string, extensionPointId?: unknown):
        Promise<PluginLoader.PluginLoadResult<unknown>> => ({
            isValidPlugin: true,
            isValidExtensionPoint: true,
            instance: new PluginA()
        }));

        mockedFs.readFile.mockImplementation((filePath: PathLike | number, callback:
        (err: NodeJS.ErrnoException, data: Buffer) => void) => {

            callback(undefined as unknown as NodeJS.ErrnoException, Buffer.from('{"type":"module", "main": "/"}'));
        });

        mockedFs.readdir.mockImplementation((folderPath: PathLike, options: { withFileTypes: boolean }, callback:
        (err: NodeJS.ErrnoException, dirents: Dirent[]) => void) => {

            let dirents: Dirent[] = [];

            const requestedPath = folderPath.toString();

            if (requestedPath.endsWith('root')) {
                dirents = [
                    new MockDirent('@fooscope', true),
                    new MockDirent('@barscope', true),
                    new MockDirent('foo', true),
                    new MockDirent('bar', true),
                ];
            } else if (requestedPath.endsWith('@fooscope')) {
                dirents = [
                    new MockDirent('foofoo', true),
                    new MockDirent('foobar', true),
                    new MockDirent('foo', true),
                    new MockDirent('bar', true)
                ];
            } else if (requestedPath.endsWith('@barscope')) {
                dirents = [
                    new MockDirent('barfoo', true),
                    new MockDirent('barbar', true),
                    new MockDirent('foo', true),
                    new MockDirent('bar', true)
                ];
            } else if (requestedPath.endsWith('foo')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('bar')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('foofoo')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('foobar')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('barfoo')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('barbar')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            }

            callback(undefined as unknown as NodeJS.ErrnoException, dirents);
        });
    });

    beforeEach(() => {
        mockedFs.readFile.mockClear();
        mockedFs.readdir.mockClear();
    });

    it('NodeModulesPluginRepository is instantiable', () => {
        expect(new NodeModulesPluginRepository<string>()).toBeInstanceOf(NodeModulesPluginRepository);
    });

    it('Get all plugins works', async () => {
        const repository = new NodeModulesPluginRepository<string>(['root']);

        const pluginIds = [];

        for await (const tuple of repository.getAllPlugins()) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(10);
        expect(mockedFs.readdir).toBeCalledTimes(3);
        expect(mockedFs.readFile).toBeCalledTimes(10);
    });

    it('Get plugins by module scope works', async () => {
        const repository = new NodeModulesPluginRepository<string>(['root']);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleScope('@fooscope')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(4);
        expect(mockedFs.readdir).toBeCalledTimes(2);
        expect(mockedFs.readFile).toBeCalledTimes(4);
    });

    it('Get plugins by module name works', async () => {
        const repository = new NodeModulesPluginRepository<string>(['root']);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleName('bar')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(3);
        expect(mockedFs.readdir).toBeCalledTimes(3);
        expect(mockedFs.readFile).toBeCalledTimes(3);
    });

    it('Get plugins by module name and scope works', async () => {
        const repository = new NodeModulesPluginRepository<string>(['root']);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleName('bar', '@barscope')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(1);
        expect(mockedFs.readdir).toBeCalledTimes(2);
        expect(mockedFs.readFile).toBeCalledTimes(1);
    });
});
