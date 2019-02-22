import { Foo, Bar } from 'index';

/**
 * Foo test
 */
describe('Foo test', () => {

    it('works if true is truthy', () => {
        expect(true).toBeTruthy();
    });

    it('Foo is instantiable', () => {
        expect(new Foo(new Bar())).toBeInstanceOf(Foo);
    });

    it('Foo dump works', () => {
        new Foo(new Bar()).dump();
    });
});
