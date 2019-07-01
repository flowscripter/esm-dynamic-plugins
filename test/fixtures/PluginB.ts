import ExtensionFactory from '../../src/api/ExtensionFactory';
import ExtensionDescriptor from '../../src/api/ExtensionDescriptor';
import Plugin from '../../src/api/Plugin';
import { EXTENSION_POINT_B } from './ExtensionPoints';
import { ExtensionDescriptorA } from './PluginA';

class ExtensionB {
}

class ExtensionFactoryB implements ExtensionFactory {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
    public create(hostData?: any): ExtensionB {
        return new ExtensionB();
    }
}

class ExtensionDescriptorB implements ExtensionDescriptor<string> {

    public extensionPointId: string = EXTENSION_POINT_B;

    public factory: ExtensionFactory = new ExtensionFactoryB();
}

export default class PluginB implements Plugin<string> {
    public extensionDescriptors: ExtensionDescriptor<string>[] = [
        new ExtensionDescriptorA(),
        new ExtensionDescriptorB()
    ];
}
