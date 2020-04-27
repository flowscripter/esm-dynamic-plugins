# esm-dynamic-plugins
[![license](https://img.shields.io/github/license/flowscripter/esm-dynamic-plugins.svg)](https://github.com/flowscripter/esm-dynamic-plugins/blob/master/LICENSE)
[![dependencies](https://img.shields.io/david/flowscripter/esm-dynamic-plugins.svg)](https://david-dm.org/flowscripter/esm-dynamic-plugins)
[![travis](https://api.travis-ci.com/flowscripter/esm-dynamic-plugins.svg)](https://travis-ci.com/flowscripter/esm-dynamic-plugins)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=flowscripter_esm-dynamic-plugins&metric=coverage)](https://sonarcloud.io/dashboard?id=flowscripter_esm-dynamic-plugins)
[![npm](https://img.shields.io/npm/v/@flowscripter/esm-dynamic-plugins.svg)](https://www.npmjs.com/package/@flowscripter/esm-dynamic-plugins)

> Plugin framework using ES Modules and Dynamic Import.

## Overview

This project provides a Javascript framework for defining plugins which may be dynamically
discovered and imported into a running Javascript process.

#### Key Features

* Universal support for both NodeJS and browser Javascript runtimes
* Dynamic plugin import using [Javascript dynamic import](https://github.com/tc39/proposal-dynamic-import)
* ES2015 module based
* Written in Typescript

#### Key Concepts

The framework's key concepts are borrowed from the Eclipse Project's extension framework. The key concepts are:

* A *HostApplication* instantiates a *PluginManager*
* The *PluginManager* provides an *ExtensionPointRegister*
* The *HostApplication* can declare *ExtensionPoints* in the *ExtensionPointRegister*
* A *Plugin* provides one or more *Extensions* for one or more *ExtensionPoints*
* A *Plugin* provides an *ExtensionDescriptor* for each *Extension* it provides
* A *PluginManager* scans for and registers *Plugins* which provide *Extensions* for the known *ExtensionPoints*
* A *HostApplication* uses the *PluginManager* to query for and select an *Extension* for a desired *ExtensionPoint*
* The *PluginManager* uses an *ExtensionFactory* declared in an *ExtensionDescriptor* to instantiate a selected *Extension*

The following high level class diagram illustrates these relationships:

![High Level Class Diagram](images/high_level_class_diagram.png "High Level Class Diagram")

The following sequence diagram illustrates the key steps for a *HostApplication* to use a *PluginManager* for discovery and registration of *Plugins*:

![Registration Sequence Diagram](images/registration_sequence_diagram.png "Registration Sequence Diagram")

Once registration has been performed, the *HostApplication* may query for and instantiate *Extensions* for known *ExtensionPoints*:

![Query and Instantiation Sequence Diagram](images/query_and_instantiation_sequence_diagram.png "Query and Instantiation Sequence Diagram")

As *ExtensionPoints* are simply Javascript classes, for the purposes of testing or validation, it is
possible to bypass the framework altogether and import an *Extension* and use it directly:

![Direct Instantiation Sequence Diagram](images/direct_instantiation_sequence_diagram.png "Direct Instantiation Sequence Diagram")

## Examples

The following example projects are available which all support execution in NodeJS and a browser:

* [TypeScript based host application](https://github.com/flowscripter/ts-example-host-app)
* [TypeScript based plugin](https://github.com/flowscripter/ts-example-plugin)
* [JavaScript based host application](https://github.com/flowscripter/js-example-host-app)
* [JavaScript based plugin](https://github.com/flowscripter/js-example-plugin)

## Code Documentation

[Typescript documentation](https://flowscripter.github.io/esm-dynamic-plugins)

## Development

Firstly:

```
npm install
```
Note: The warnings regarding peer dependencies are caused by dependencies or sub-dependencies which have yet to
update their peer-dependencies. They can safely be ignored.

Build: `npm run build`

Watch: `npm run watch`

Test: `npm test`

Lint: `npm run lint`

Docs: `npm run docs`

The following diagram provides an overview of the main classes:

![Implementation Class Diagram](images/implementation_class_diagram.png "Implementation Class Diagram")

## Further Details

Further details on project configuration files and Javascript version support can be found in
the [template for this project](https://github.com/flowscripter/ts-template/blob/master/README.md#overview).

## Alternatives

* [js-plugins](https://github.com/easeway/js-plugins) - also provides a plugin framework following Eclipse Project's framework. Relies on plugin declarations in `package.json` instead of Typescript interfaces.
Does not support browser or ES2015 modules.
* [oclif plugins](https://oclif.io/docs/plugins) - very much tied to the Oclif CLI. Relies on available plugins being declared in `package.json`. Does not support browser or ES2015 modules.

## License

MIT © Flowscripter
