# esm-dynamic-plugins
[![license](https://img.shields.io/github/license/flowscripter/esm-dynamic-plugins.svg)](https://github.com/flowscripter/esm-dynamic-plugins/blob/master/LICENSE.md)
[![dependencies](https://img.shields.io/david/flowscripter/esm-dynamic-plugins.svg)](https://david-dm.org/flowscripter/esm-dynamic-plugins)
[![travis](https://api.travis-ci.com/flowscripter/esm-dynamic-plugins.svg)](https://travis-ci.com/flowscripter/esm-dynamic-plugins)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=flowscripter_esm-dynamic-plugins&metric=coverage)](https://sonarcloud.io/dashboard?id=flowscripter_esm-dynamic-plugins)
[![npm](https://img.shields.io/npm/v/@flowscripter/esm-dynamic-plugins.svg)](https://www.npmjs.com/package/@flowscripter/esm-dynamic-plugins)

> Plugin framework using ES Modules and Dynamic Import.

## Overview

This project provides a Javascript framework for developing, deploying and installing plugins which may be dynamically 
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

#### NO LEGACY SUPPORT

Please note, that this project makes no attempt to support legacy Javascript versions or runtimes. 
Browsers and NodeJS versions need to support:

* https://github.com/tc39/proposal-dynamic-import
* https://tc39.github.io/ecmascript-asyncawait/
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

Because of this the project's exported module is configured so that:
 
* no transpiling is performed (apart from TypeScript to ES2015 JavaScript)
* `package.json` specifies:
    * `"main": "dist/index.js"`
    * `"type": "module"`
    * `"node": ">=10.15.1"` so that the `--experimental-modules` flag can be used

## API

[API documentation](https://flowscripter.github.io/esm-dynamic-plugins)

## Development

Firstly: 

```
npm install
```

then:

Build: `npm run build`

Watch: `npm run watch`

Test: `npm test`

Lint: `npm run lint`

Docs: `npm run docs`

The following diagram provides an overview of the main classes:

![Implementation Class Diagram](images/implementation_class_diagram.png "Implementation Class Diagram")

## License

MIT © Vectronic
