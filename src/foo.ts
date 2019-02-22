/**
 * @module @flowscripter/ts-template
 */
import debug from 'debug';

import Bar from 'bar';

/**
 * Foo for a [[Bar]]
 */
export default class PluginDescriptor {

    public readonly bar: Bar;

    private readonly log: debug.Debugger;


    /**
     * Constructor
     *
     * @param bar - the [[Bar]] this is a Foo for
     */
    public constructor(bar: Bar) {
        this.log = debug('Foo');
        this.bar = bar;
    }


    /**
     * Dump information to log
     */
    public dump(): void {
        this.log('Foo:');
        this.bar.dump();
    }
}
