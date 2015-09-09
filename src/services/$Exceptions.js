/**
 * @module $Exceptions.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

import {
    bold,
    red,
    cyan
} from  'chalk';

class $$MissingParentModuleError extends Error {
    constructor() {
        super(bold(red(
            'Angie REST Framework cannot be used outside Angie dependency ' +
            'modules'
        )));
    }
}

class $$InvalidRESTfulControllerError extends SyntaxError {
    constructor(name) {
        super(
            bold(red(`Invalid configuration for Controller ${cyan(name)}: `)) +
            bold(
                'Controller must be a valid JavaScript class with a constructor'
            )
        );
    }
}

export {
    $$MissingParentModuleError,
    $$InvalidRESTfulControllerError
};