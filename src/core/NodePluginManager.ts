/**
 * @module @flowscripter/esm-dynamic-plugins-core
 */

import BasePluginManager from './BasePluginManager';
import NodeModulesPluginRepository from './repository/NodeModulesPluginRepository';

/**
 * Implementation of a [[PluginManager]] for a Node JS runtime.
 *
 * Supports a `node_modules` structure of Node JS packages defined via `package.json`.
 *
 * The `package.json` for each plugin should specify a `type` of `module` and `main` should reference the
 * module which provides a default export of the [[Plugin]] implementation.
 */
export default class NodePluginManager extends BasePluginManager<string> {

    /**
     * Constructor configures the instance using the optionally specified array of `node_modules` search paths.
     *
     * If the search paths are not specified the default is to search within:
     *
     * * `process.cwd() + node_modules`
     * * `process.config.variables.node_prefix + lib/node_modules`
     *
     * These search paths are expected to include sub-folder package or `@scope` folders containing sub-folder
     * packages.
     *
     * NOTE: If the optional search paths are specified, the default values are replaced.
     *
     * @param searchPaths optional array of search paths.
     */
    public constructor(searchPaths?: string[]) {
        super(new NodeModulesPluginRepository(searchPaths));
    }
}
