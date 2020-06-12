/**
 * @module @flowscripter/esm-dynamic-plugins
 */

import BasePluginManager from './BasePluginManager';
import UrlPluginRepository from '../repository/UrlPluginRepository';

/**
 * Implementation of a [[PluginManager]] for a browser runtime.
 *
 * Supports modules hosted at a list of URLs of the form:
 *
 * `https://<host>/[@scope/<name>]`
 *
 * e.g.:
 *
 * `https://unpkg.com/@my-scope/my-plugin-module`
 *
 *
 */
export default class BrowserPluginManager extends BasePluginManager<string> {

    /**
     * Constructor configures the instance using the specified array of module URLs.
     *
     * These URLs are filtered by scope and module name if specified. The modules will then be loaded and filtered
     * by extension ID if this has been specified.
     *
     * @param moduleUrls array of module URLs.
     */
    public constructor(moduleUrls: string[]) {
        super(new UrlPluginRepository(moduleUrls));
    }
}
