import BrowserPluginManager from '../../src/manager/BrowserPluginManager';
import PluginA from '../fixtures/PluginA';
import PluginB from '../fixtures/PluginB';
import Plugin from '../../src/api/Plugin';

jest.mock('../../src/repository/UrlPluginRepository', () => function mock() {
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

describe('BrowserPluginManager test', () => {

    test('BrowserPluginManager is instantiable', () => {
        expect(new BrowserPluginManager(['https://foo.com/bar'])).toBeInstanceOf(BrowserPluginManager);
    });

    test('Plugin can be registered successfully', async () => {
        const manager = new BrowserPluginManager(['https://foo.com/bar']);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(0);
        expect(await manager.registerPluginsByModuleName('PluginA')).toEqual(1);
        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
    });
});
