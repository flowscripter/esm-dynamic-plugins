import fs, { Dirent, PathLike } from 'fs';

import NodeModulesPluginRepository from '../../../src/core/repository/NodeModulesPluginRepository';

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

        mockedFs.readFile.mockImplementation((filePath: PathLike | number, callback:
        (err: NodeJS.ErrnoException, data: Buffer) => void) => {

            callback(undefined as unknown as NodeJS.ErrnoException, Buffer.from(''));
        });

        mockedFs.readdir.mockImplementation((folderPath: PathLike, options: { withFileTypes: boolean }, callback:
        (err: NodeJS.ErrnoException, dirents: Dirent[]) => void) => {

            let dirents: Dirent[] = [];

            const requestedPath = folderPath.toString();

            if (requestedPath.endsWith('root')) {
                dirents = [
                    new MockDirent('@fooscopeFolder', true),
                    new MockDirent('@barscopeFolder', true),
                    new MockDirent('fooFolder', true),
                    new MockDirent('barFolder', true),
                ];
            } else if (requestedPath.endsWith('@fooscopeFolder')) {
                dirents = [
                    new MockDirent('foofooFolder', true),
                    new MockDirent('foobarFolder', true),
                ];
            } else if (requestedPath.endsWith('@barscopeFolder')) {
                dirents = [
                    new MockDirent('barfooFolder', true),
                    new MockDirent('barbarFolder', true),
                    new MockDirent('fooFolder', true),
                    new MockDirent('barFolder', true)
                ];
            } else if (requestedPath.endsWith('fooFolder')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('barFolder')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('foofooFolder')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('foobarFolder')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('barfooFolder')) {
                dirents = [
                    new MockDirent('ignore', true),
                    new MockDirent('package.json', false)
                ];
            } else if (requestedPath.endsWith('barbarFolder')) {
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

        expect(pluginIds).toHaveLength(0);
        expect(mockedFs.readdir).toBeCalledTimes(3);
        expect(mockedFs.readFile).toBeCalledTimes(8);
    });

    it('Get plugins by module scope works', async () => {
        const repository = new NodeModulesPluginRepository<string>(['root']);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleScope('@fooscopeFolder')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(0);
        expect(mockedFs.readdir).toBeCalledTimes(2);
        expect(mockedFs.readFile).toBeCalledTimes(2);
    });

    it('Get plugins by module name works', async () => {
        const repository = new NodeModulesPluginRepository<string>(['root']);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleName('barFolder')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(0);
        expect(mockedFs.readdir).toBeCalledTimes(3);
        expect(mockedFs.readFile).toBeCalledTimes(2);
    });

    it('Get plugins by module name and scope works', async () => {
        const repository = new NodeModulesPluginRepository<string>(['root']);

        const pluginIds = [];

        for await (const tuple of repository.getPluginsByModuleName('barFolder', '@barscopeFolder')) {
            pluginIds.push(tuple[0]);
        }

        expect(pluginIds).toHaveLength(0);
        expect(mockedFs.readdir).toBeCalledTimes(2);
        expect(mockedFs.readFile).toBeCalledTimes(1);
    });
});
