/**
 * @module $Exceptions.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

import {cyan} from          'chalk';
import $LogProvider from    'angie-log';

class $$MissingParentModuleError extends Error {
    constructor() {
        const msg = 'Angie REST Framework cannot be used outside Angie ' +
            'dependency modules';
        $LogProvider.error(msg);
        super();
    }
}

class $$InvalidRESTfulControllerError extends SyntaxError {
    constructor(name) {
        const msg = `Invalid configuration for Controller ${cyan(name)}: ` +
            'Controller must be a valid JavaScript class with a constructor';
        $LogProvider.error(msg);
        super();
    }
}

class $$InvalidSerializerConfiguration extends ReferenceError {
    constructor(name = '') {
        const msg = `No serializers specified for Controller ${cyan(name)}`;
        $LogProvider.error(msg);
        super();
    }
}

class $$InvalidRendererConfiguration extends ReferenceError {
    constructor(name = '') {
        const msg = `No renderers specified for Controller ${cyan(name)}`;
        $LogProvider.error(msg);
        super();
    }
}

class $$UnsuccessfulDataSerializationError extends Error {
    constructor(name = 'serializer') {
        const msg = `The ${cyan(name)} was not found or failed to parse ` +
            'the request data';
        $LogProvider.error(msg);
        super(msg);
    }
}

class $$UnsuccessfulDataRenderingError extends Error {
    constructor(name = 'renderer') {
        const msg = `The ${cyan(name)} was not found or failed to render ` +
            'the response data';
        $LogProvider.error(msg);
        super(msg);
    }
}

export {
    $$MissingParentModuleError,
    $$InvalidRESTfulControllerError,
    $$InvalidSerializerConfiguration,
    $$InvalidRendererConfiguration,
    $$UnsuccessfulDataSerializationError,
    $$UnsuccessfulDataRenderingError
};