import Plugin from '../../src/api/Plugin';
import BasePluginManager from '../../src/manager/BasePluginManager';
import PluginA from '../fixtures/PluginA';
import PluginB from '../fixtures/PluginB';
import { EXTENSION_POINT_A_ID } from '../fixtures/ExtensionPointA';
import { EXTENSION_POINT_B_ID } from '../fixtures/ExtensionPointB';
import NodeModulesPluginRepository from '../../src/repository/NodeModulesPluginRepository';

jest.mock('../../src/repository/NodeModulesPluginRepository');
const mockedRepository = new NodeModulesPluginRepository() as jest.Mocked<NodeModulesPluginRepository<string>>;

describe('BasePluginManager test', () => {

    beforeAll(() => {

        mockedRepository.getPluginsByModuleName.mockImplementation((name: string, scope?: string) => {
            let i = 0;
            return {
                [Symbol.asyncIterator]() {
                    return {
                        next() {
                            if (i === 0) {
                                i += 1;
                                if (scope && scope !== 'foo') {
                                    return Promise.resolve({
                                        value: undefined as unknown as [string, Plugin<string>],
                                        done: true
                                    });
                                }
                                if (scope && name !== 'PluginA') {
                                    return Promise.resolve({
                                        value: undefined as unknown as [string, Plugin<string>],
                                        done: true
                                    });
                                }
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

        mockedRepository.getPluginsByModuleScope.mockImplementation((scope: string) => {
            let i = 0;
            return {
                [Symbol.asyncIterator]() {
                    return {
                        next() {
                            if (i === 0) {
                                i += 1;
                                if (scope && scope === 'foo') {
                                    return Promise.resolve({
                                        value: [
                                            'PluginA',
                                            new PluginA()
                                        ],
                                        done: false
                                    });
                                }
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

        mockedRepository.getPluginsByExtensionPoint.mockImplementation((extensionPointId: string) => {
            let i = 0;
            return {
                [Symbol.asyncIterator]() {
                    return {
                        next() {
                            if (i === 0) {
                                i += 1;
                                if (extensionPointId === EXTENSION_POINT_A_ID) {
                                    return Promise.resolve({
                                        value: [
                                            'PluginA',
                                            new PluginA()
                                        ],
                                        done: false
                                    });
                                }
                                return Promise.resolve({
                                    value: [
                                        'PluginB',
                                        new PluginB()
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

        mockedRepository.getPluginsByModuleScopeAndExtensionPoint.mockImplementation((scope: string,
            extensionPointId: string) => {
            let i = 0;
            return {
                [Symbol.asyncIterator]() {
                    return {
                        next() {
                            if (i === 0) {
                                i += 1;
                                if ((scope === 'foo') && (extensionPointId === EXTENSION_POINT_A_ID)) {
                                    return Promise.resolve({
                                        value: [
                                            'PluginA',
                                            new PluginA()
                                        ],
                                        done: false
                                    });
                                }
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

    test('BasePluginManager is instantiable', () => {
        expect(new BasePluginManager<string>(new NodeModulesPluginRepository<string>()))
            .toBeInstanceOf(BasePluginManager);
    });

    test('Extension Point can be registered successfully', () => {
        const manager = new BasePluginManager<string>(new NodeModulesPluginRepository<string>());

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(0);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(1);
    });

    test('Extension Point cannot be registered twice', () => {
        const manager = new BasePluginManager<string>(new NodeModulesPluginRepository<string>());

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(() => {
            manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        }).toThrow();
    });

    test('Two extension points can be registered', () => {
        const manager = new BasePluginManager<string>(new NodeModulesPluginRepository<string>());

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(1);

        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(2);
    });

    test('Plugin can be registered successfully', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(0);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByModuleName).toBeCalledTimes(1);
    });

    test('Plugin is not re-registered', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(0);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByModuleName).toBeCalledTimes(2);
    });

    test('Two plugins can be registered', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(2);
        expect(mockedRepository.getPluginsByModuleName).toBeCalledTimes(2);
    });

    test('Plugins can be registered by scope', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleScope('foo')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByModuleScope).toBeCalledTimes(1);
    });

    test('Plugins can be registered by scope and name', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleName('PluginA', 'foo')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByModuleName).toBeCalledTimes(1);
    });

    test('Plugins can be registered by extension point', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByExtensionPoint(EXTENSION_POINT_B_ID)).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByExtensionPoint).toBeCalledTimes(1);
    });

    test('Plugins can be registered by scope and extension point', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleScopeAndExtensionPoint('foo',
            EXTENSION_POINT_A_ID)).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
        expect(mockedRepository.getPluginsByModuleScopeAndExtensionPoint).toBeCalledTimes(1);
    });

    test('Extension Details can be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(0);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(1);
    });

    test('Extension Details for same Extension Point across two Plugins can be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(2);
    });

    test('Extension Details for two Extension Points across two Plugins can be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);
        manager.registerExtensionPoint(EXTENSION_POINT_B_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(2);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B_ID))).toHaveLength(1);
    });

    test('Extension Details returned with plugin and extension data', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        const extensionDetails = Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))[0];

        expect(extensionDetails.extensionData).not.toBeNull();
        expect(extensionDetails.pluginData).not.toBeNull();
    });

    test('Extension Details for unknown Extension Point cannot be retrieved', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B_ID))).toHaveLength(0);
    });

    test('Unknown extension cannot be instantiated', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        await expect(manager.instantiate('foo')).rejects.toThrow();
    });

    test('Extension can be instantiated', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        const extensionDetails = Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))[0];

        const extension = await manager.instantiate(extensionDetails.extensionHandle);

        extension.sayHello();
    });

    test('Extension for unknown extension point is not registered', async () => {
        const manager = new BasePluginManager<string>(mockedRepository);

        manager.registerExtensionPoint(EXTENSION_POINT_A_ID);

        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);

        expect(await manager.registerPluginsByModuleName('PluginB')).toEqual(1);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A_ID))).toHaveLength(2);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B_ID))).toHaveLength(0);
    });
});
