/**
 * @module $Exceptions.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

import {cyan} from          'chalk';
import $LogProvider from    'angie-log';

class $$MissingParentModuleError {
    constructor() {
        const msg = 'Angie REST Framework cannot be used outside Angie ' +
            'dependency modules';
        $LogProvider.error(msg);
        throw new Error(msg);
    }
}

class $$InvalidRESTfulControllerError {
    constructor(name) {
        const msg = `Invalid configuration for Controller ${cyan(name)}: ` +
            'Controller must be a valid JavaScript class with a constructor';
        $LogProvider.error(msg);
        throw new SyntaxError(msg);
    }
}

class $$InvalidSerializerConfiguration {
    constructor(name = '') {
        const msg = `No serializers specified for Controller ${cyan(name)}`;
        $LogProvider.error(msg);
        throw new ReferenceError(msg);
    }
}

class $$InvalidRendererConfiguration extends ReferenceError {
    constructor(name = '') {
        const msg = `No renderers specified for Controller ${cyan(name)}`;
        $LogProvider.error(msg);
        throw new ReferenceError(msg);
    }
}

export {
    $$MissingParentModuleError,
    $$InvalidRESTfulControllerError,
    $$InvalidSerializerConfiguration,
    $$InvalidRendererConfiguration
};