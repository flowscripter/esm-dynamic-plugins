import ExtensionFactory from '../../src/api/ExtensionFactory';
import ExtensionDescriptor from '../../src/api/ExtensionDescriptor';
import Plugin from '../../src/api/Plugin';
import ExtensionPointB, { EXTENSION_POINT_B_ID } from './ExtensionPointB';
import { ExtensionDescriptorA } from './PluginA';

class ExtensionB implements ExtensionPointB {

    // eslint-disable-next-line class-methods-use-this
    public sayGoodbye(): void {
    }
}

class ExtensionFactoryB implements ExtensionFactory {
    // eslint-disable-next-line class-methods-use-this
    public create(): Promise<ExtensionB> {
        return Promise.resolve(new ExtensionB());
    }
}

class ExtensionDescriptorB implements ExtensionDescriptor<string> {

    public extensionPointId: string = EXTENSION_POINT_B_ID;

    public factory: ExtensionFactory = new ExtensionFactoryB();
}

export default class PluginB implements Plugin<string> {
    public extensionDescriptors: ExtensionDescriptor<string>[] = [
        new ExtensionDescriptorA(),
        new ExtensionDescriptorB()
    ];
}
