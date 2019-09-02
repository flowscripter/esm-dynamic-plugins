import NodePluginManager from '../../src/manager/NodePluginManager';
import PluginA from '../fixtures/PluginA';
import PluginB from '../fixtures/PluginB';
import Plugin from '../../src/api/Plugin';

jest.mock('../../src/repository/NodeModulesPluginRepository', () => function mock() {
    return {
        getPluginsByModuleName: (name: string) => {
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
        }
    };
});

describe('NodePluginManager test', () => {

    test('NodePluginManager is instantiable', () => {
        expect(new NodePluginManager()).toBeInstanceOf(NodePluginManager);
    });

    test('Plugin can be registered successfully', async () => {
        const manager = new NodePluginManager();

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(0);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
    });
});
