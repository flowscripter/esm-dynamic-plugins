import BasePluginManager from '../../src/core/BasePluginManager';

describe('BasePluginManager test', () => {

    it('BasePluginManager is instantiable', () => {
        expect(new BasePluginManager<string, string>()).toBeInstanceOf(BasePluginManager);
    });
});
