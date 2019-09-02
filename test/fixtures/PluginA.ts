/* eslint-disable max-classes-per-file */
import ExtensionFactory from '../../src/api/ExtensionFactory';
import ExtensionDescriptor from '../../src/api/ExtensionDescriptor';
import Plugin from '../../src/api/Plugin';
import ExtensionPointA, { EXTENSION_POINT_A_ID } from './ExtensionPointA';

class ExtensionA implements ExtensionPointA {

    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-empty-function
    public sayHello(): void {
    }
}

class ExtensionFactoryA implements ExtensionFactory {
    // eslint-disable-next-line class-methods-use-this
    public create(): Promise<ExtensionA> {
        return Promise.resolve(new ExtensionA());
    }
}

export class ExtensionDescriptorA implements ExtensionDescriptor<string> {

    public extensionPointId: string = EXTENSION_POINT_A_ID;

    public factory: ExtensionFactory = new ExtensionFactoryA();

    public extensionData = 'foo';
}

export default class PluginA implements Plugin<string> {
    public extensionDescriptors: ExtensionDescriptor<string>[] = [
        new ExtensionDescriptorA()
    ];

    public pluginData = 'bar';
}
