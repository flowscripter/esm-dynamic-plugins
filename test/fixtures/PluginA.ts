import ExtensionFactory from '../../src/api/ExtensionFactory';
import ExtensionDescriptor from '../../src/api/ExtensionDescriptor';
import Plugin from '../../src/api/Plugin';
import { EXTENSION_POINT_A } from './ExtensionPoints';

class ExtensionA {

    // eslint-disable-next-line class-methods-use-this
    public sayHello(): void {
    }
}

class ExtensionFactoryA implements ExtensionFactory {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
    public create(hostData?: any): ExtensionA {
        return new ExtensionA();
    }
}

export class ExtensionDescriptorA implements ExtensionDescriptor<string> {

    public extensionPointId: string = EXTENSION_POINT_A;

    public factory: ExtensionFactory = new ExtensionFactoryA();

    public extensionData = 'foo';
}

export default class PluginA implements Plugin<string> {
    public extensionDescriptors: ExtensionDescriptor<string>[] = [
        new ExtensionDescriptorA()
    ];

    public pluginData = 'bar';
}
