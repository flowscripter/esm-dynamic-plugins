import { Bar } from 'index';

/**
 * Bar test
 */
describe('Bar test', () => { // eslint-disable-line @typescript-eslint/explicit-function-return-type

    it('works if true is truthy', () => { // eslint-disable-line @typescript-eslint/explicit-function-return-type
        expect(true).toBeTruthy();
    });

    it('Bar is instantiable', () => { // eslint-disable-line @typescript-eslint/explicit-function-return-type
        expect(new Bar()).toBeInstanceOf(Bar);
    });

    it('Bar dump works', () => { // eslint-disable-line @typescript-eslint/explicit-function-return-type
        new Bar().dump();
    });
});
