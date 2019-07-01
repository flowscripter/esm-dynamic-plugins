import ExtensionFactory from '../../src/api/ExtensionFactory';
import ExtensionDetails from '../../src/api/ExtensionDetails';
import Plugin from '../../src/api/Plugin';
import { EXTENSION_POINT_B } from './ExtensionPoints';
import { ExtensionDetailsA } from './PluginA';

class ExtensionB {
}

class ExtensionFactoryB implements ExtensionFactory {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
    public create(hostData?: any): ExtensionB {
        return new ExtensionB();
    }
}

class ExtensionDetailsB implements ExtensionDetails<string> {

    // eslint-disable-next-line class-methods-use-this
    public getExtensionPointId(): string {
        return EXTENSION_POINT_B;
    }

    // eslint-disable-next-line class-methods-use-this
    public getFactory(): ExtensionFactory {
        return new ExtensionFactoryB();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
    public getExtensionData(): any {
    }
}

export default class PluginB implements Plugin<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
    public getExtensionDetails(): ExtensionDetails<string>[] {
        return [
            new ExtensionDetailsA(),
            new ExtensionDetailsB()
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
    public getPluginData(): any {
    }
}
