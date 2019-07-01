import BasePluginManager from '../../src/core/BasePluginManager';
import PluginA from '../fixtures/PluginA';
import PluginB from '../fixtures/PluginB';
import { EXTENSION_POINT_A, EXTENSION_POINT_B } from '../fixtures/ExtensionPoints';

describe('BasePluginManager test', () => {

    it('BasePluginManager is instantiable', () => {
        expect(new BasePluginManager<string, string>()).toBeInstanceOf(BasePluginManager);
    });

    it('Extension Point can be registered successfully', () => {

        const manager = new BasePluginManager<string, string>();

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(0);

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(1);
    });

    it('Extension Point cannot be registered twice', () => {

        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        expect(() => {
            manager.registerExtensionPoint(EXTENSION_POINT_A);
        }).toThrow();
    });

    it('Two extension points can be registered', () => {

        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(1);

        manager.registerExtensionPoint(EXTENSION_POINT_B);

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(2);
    });

    it('Plugin can be registered successfully', () => {

        const pluginId = 'foo';
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(0);

        manager.registerPlugin(pluginId, new PluginA());

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);
    });

    it('Plugin cannot be registered for unknown extension point', () => {

        const pluginId = 'foo';
        const manager = new BasePluginManager<string, string>();

        expect(() => {
            manager.registerPlugin(pluginId, new PluginA());
        }).toThrow();
    });

    it('Plugin cannot be re-registered with same ID', () => {

        const pluginId = 'foo';
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        manager.registerPlugin(pluginId, new PluginA());

        expect(() => {
            manager.registerPlugin(pluginId, new PluginA());
        }).toThrow();
    });

    it('Plugin can be registered twice with different IDs although this is not recommended', () => {

        const pluginIdA1 = 'foo';
        const pluginIdA2 = 'bar';
        const pluginA = new PluginA();
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        manager.registerPlugin(pluginIdA1, pluginA);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);

        manager.registerPlugin(pluginIdA2, pluginA);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(2);
    });

    it('Two plugins can be registered', () => {

        const pluginIdA = 'foo';
        const pluginIdB = 'bar';
        const pluginA = new PluginA();
        const pluginB = new PluginB();
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);
        manager.registerExtensionPoint(EXTENSION_POINT_B);

        manager.registerPlugin(pluginIdA, pluginA);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(1);

        manager.registerPlugin(pluginIdB, pluginB);

        expect(Array.from(manager.getRegisteredPlugins())).toHaveLength(2);
    });

    it('Extension Details can be retrieved', () => {

        const pluginId = 'foo';
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A))).toHaveLength(0);

        manager.registerPlugin(pluginId, new PluginA());

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A))).toHaveLength(1);
    });

    it('Extension Details for same Extension Point across two Plugins can be retrieved', () => {

        const pluginIdA = 'foo';
        const pluginIdB = 'bar';
        const pluginA = new PluginA();
        const pluginB = new PluginB();
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);
        manager.registerExtensionPoint(EXTENSION_POINT_B);

        manager.registerPlugin(pluginIdA, pluginA);
        manager.registerPlugin(pluginIdB, pluginB);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A))).toHaveLength(2);
    });

    it('Extension Details for two Extension Points across two Plugins can be retrieved', () => {

        const pluginIdA = 'foo';
        const pluginIdB = 'bar';
        const pluginA = new PluginA();
        const pluginB = new PluginB();
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);
        manager.registerExtensionPoint(EXTENSION_POINT_B);

        manager.registerPlugin(pluginIdA, pluginA);
        manager.registerPlugin(pluginIdB, pluginB);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A))).toHaveLength(2);
        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B))).toHaveLength(1);
    });

    it('Extension Details returned with plugin and extension data', () => {

        const pluginIdA = 'foo';
        const pluginA = new PluginA();
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        manager.registerPlugin(pluginIdA, pluginA);

        const extensionDetails = Array.from(manager.getExtensions(EXTENSION_POINT_A))[0];

        expect(extensionDetails.extensionData).not.toBeNull();
        expect(extensionDetails.pluginData).not.toBeNull();
    });

    it('Extension Details for unknown Extension Point cannot be retrieved', () => {

        const pluginId = 'foo';
        const manager = new BasePluginManager<string, string>();

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_A))).toHaveLength(0);

        manager.registerPlugin(pluginId, new PluginA());

        expect(Array.from(manager.getExtensions(EXTENSION_POINT_B))).toHaveLength(0);
    });

    it('Unknown extension cannot be instantiated', () => {

        const handle = 'foo';
        const manager = new BasePluginManager<string, string>();

        expect(() => {
            manager.instantiate(handle);
        }).toThrow();
    });

    it('Extension can be instantiated', () => {

        const pluginId = 'foo';
        const manager = new BasePluginManager<string, string>();

        expect(Array.from(manager.getRegisteredExtensionPoints())).toHaveLength(0);

        manager.registerExtensionPoint(EXTENSION_POINT_A);

        manager.registerPlugin(pluginId, new PluginA());

        const extensionDetails = Array.from(manager.getExtensions(EXTENSION_POINT_A))[0];

        expect(extensionDetails.pluginId).toEqual(pluginId);

        const extension = manager.instantiate(extensionDetails.extensionHandle);

        extension.sayHello();
    });
});
