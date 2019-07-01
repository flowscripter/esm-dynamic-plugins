/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import ExtensionPointRegistry from './ExtensionPointRegistry';

/**
 * Simple implementation of an [[ExtensionPointRegistry]] using an in-memory array.
 *
 * @typeparam EP_ID is the type of the Extension Point IDs used in this [[ExtensionPointRegistry]] instance.
 */
export default class InMemoryExtensionPointRegistry<EP_ID> implements ExtensionPointRegistry<EP_ID> {

    private readonly extensionPoints: EP_ID[] = [];

    /**
     * @inheritdoc
     *
     * @throws *Error* if the specified plugin ID has already been registered
     */
    public register(extensionPoint: EP_ID): void {

        if (this.isRegistered(extensionPoint)) {
            throw new Error(`Extension Point ${extensionPoint} already registered`);
        }
        this.extensionPoints.push(extensionPoint);
    }

    /**
     * @inheritdoc
     */
    public getAll(): Iterable<EP_ID> {
        return this.extensionPoints;
    }

    /**
     * @inheritdoc
     */
    public isRegistered(extensionPoint: EP_ID): boolean {
        return this.extensionPoints.includes(extensionPoint);
    }
}
