/**
 * @module @flowscripter/ts-template
 */
import debug from 'debug';


/**
 * Bar
 */
export default class Bar {

    private readonly log: debug.Debugger;


    /**
     * Constructor
     */
    public constructor() {
        this.log = debug('Bar');
    }


    /**
     * Dump information to log
     */
    public dump(): void {
        this.log('Bar');
    }
}
