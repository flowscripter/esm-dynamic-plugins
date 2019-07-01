import ExtensionFactory from '../../src/api/ExtensionFactory';
import ExtensionDetails from '../../src/api/ExtensionDetails';
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

export class ExtensionDetailsA implements ExtensionDetails<string> {

    // eslint-disable-next-line class-methods-use-this
    public getExtensionPointId(): string {
        return EXTENSION_POINT_A;
    }

    // eslint-disable-next-line class-methods-use-this
    public getFactory(): ExtensionFactory {
        return new ExtensionFactoryA();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
    public getExtensionData(): any {
        return 'foo';
    }
}

export default class PluginA implements Plugin<string> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
    public getExtensionDetails(): ExtensionDetails<string>[] {
        return [
            new ExtensionDetailsA()
        ];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, class-methods-use-this
    public getPluginData(): any {
        return 'bar';
    }
}
