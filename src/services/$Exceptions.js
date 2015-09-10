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

export {
    $$MissingParentModuleError,
    $$InvalidRESTfulControllerError
};