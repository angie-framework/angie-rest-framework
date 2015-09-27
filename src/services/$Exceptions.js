/**
 * @module $Exceptions.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

import { cyan } from        'chalk';
import $LogProvider from    'angie-log';

/**
 * @desc An exception thrown when the Angie package is missing. This package can
 * only be used as a byproduct of the Angie Framework.
 * @since 0.0.1
 * @access private
 */
class $$MissingParentModuleError {

    /**
     * @desc Throws a generic Error
     */
    constructor() {
        if (global.ANGIE_REST_FRAMEWORK_TEST_ENV === false) {
            const msg = 'Angie REST Framework cannot be used outside Angie ' +
                'dependency modules';
            $LogProvider.error(msg);
            throw new Error(msg);
        }
    }
}

/**
 * @desc An exception thrown if an invalid RESTful Controller is declared. In
 * the scope of the REST framework, all Controllers must be valid JavaScript
 * classes.
 * @since 0.0.1
 * @access private
 */
class $$InvalidRESTfulControllerError {

    /**
     * @desc Throws a SyntaxError
     * @access public
     * @since 0.0.1
     */
    constructor(name = '') {
        const msg = `Invalid configuration for Controller ${cyan(name)}: ` +
            'Controller must be a valid JavaScript class with a constructor';
        $LogProvider.error(msg);
        throw new SyntaxError(msg);
    }
}

/**
 * @desc An exception thrown if no serializers are found on the config, on the
 * declared Controller, or on the instantiated controller. A valid RESTful
 * Controller must have one or more serializers and a renderer.
 * @since 0.0.1
 * @access private
 */
class $$InvalidSerializerConfiguration {

    /**
     * @desc Throws a ReferenceError
     * @access public
     * @since 0.0.1
     */
    constructor(name = '') {
        const msg = `No serializers specified for Controller ${cyan(name)}`;
        $LogProvider.error(msg);
        throw new ReferenceError(msg);
    }
}

/**
 * @desc An exception thrown if no renderer is found on the config, on the
 * declared Controller, or on the instantiated controller. A valid RESTful
 * Controller must have one or more serializers and a renderer.
 * @since 0.0.1
 * @access private
 */
class $$InvalidRendererConfiguration {

    /**
     * @desc Throws a ReferenceError
     * @access public
     * @since 0.0.1
     */
    constructor(name = '') {
        const msg = `No renderer specified for Controller ${cyan(name)}`;
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