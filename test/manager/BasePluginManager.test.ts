import Plugin from '../../src/api/Plugin';
import BasePluginManager from '../../src/manager/BasePluginManager';
import PluginA from '../fixtures/PluginA';
import PluginB from '../fixtures/PluginB';
import { EXTENSION_POINT_A_ID } from '../fixtures/ExtensionPointA';
import { EXTENSION_POINT_B_ID } from '../fixtures/ExtensionPointB';
import NodeModulesPluginRepository from '../../src/repository/NodeModulesPluginRepository';

jest.mock('../../src/repository/NodeModulesPluginRepository');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockedRepository: jest.Mocked<NodeModulesPluginRepository<string>> = new NodeModulesPluginRepository() as any;

describe('BasePluginManager test', () => {

    beforeAll(() => {

        mockedRepository.getPluginsByModuleName.mockImplementation((name: string) => {
            let i = 0;
            return {
                [Symbol.asyncIterator]() {
                    return {
                        next() {
                            if (i === 0) {
                                i += 1;
                                return Promise.resolve({
                                    value: [
                                        name,
                                        name === 'PluginA' ? new PluginA() : new PluginB()
                                    ],
                                    done: false
                                });
                            }
                            return Promise.resolve({
                                value: undefined as unknown as [string, Plugin<string>],
                                done: true
                            });
                        }
                    };
                }
            };
        });
    });

    beforeEach(() => {
        mockedRepository.getPluginsByModuleName.mockClear();
    });

    it('BasePluginManager is instantiable', () => {
        expect(new BasePluginManager<string>(new NodeModulesPluginRepository<string>()))
            .toBeInstanceOf(BasePluginManager);
    });

    it('Extension Point can be registered successfully', () => {
        const manager = new BasePluginManager<string>(new NodeModulesPluginRepository<string>());

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(0);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(1);
    });

    it('Extension Point cannot be registered twice', () => {
        const manager = new BasePluginManager<string>(new NodeModulesPluginRepository<string>());

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(() => {
            manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        }).toThrow();
    });

    it('Two extension points can be registered', () => {
        const manager = new BasePluginManager<string>(new NodeModulesPluginRepository<string>());

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(1);

        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(2);
    });

    it('Plugin can be registered successfully', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(0);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByModuleName).toBeCalledTimes(1);
    });

    it('Plugin is not re-registered', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(0);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByModuleName).toBeCalledTimes(2);
    });

    it('Two plugins can be registered', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(2);
        expect(mockedRepository.getPluginsByModuleName).toBeCalledTimes(2);
    });

    it('Extension Details can be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(0);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(1);
    });

    it('Extension Details for same Extension Point across two Plugins can be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(2);
    });

    it('Extension Details for two Extension Points across two Plugins can be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(2);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B_ID))).toHaveLength(1);
    });

    it('Extension Details returned with plugin and extension data', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        const extensionDetails = Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))[0];

        expect(extensionDetails.extensionData).not.toBeNull();
        expect(extensionDetails.pluginData).not.toBeNull();
    });

    it('Extension Details for unknown Extension Point cannot be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B_ID))).toHaveLength(0);
    });

    it('Unknown extension cannot be instantiated', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        await expect(manager.instantiate('foo')).rejects.toThrow();
    });

    it('Extension can be instantiated', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        const extensionDetails = Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))[0];

        const extension = await manager.instantiate(extensionDetails.extensionHandle);

        extension.sayHello();
    });

    it('Extension for unknown extension point is not registered', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(2);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B_ID))).toHaveLength(0);
    });
});
