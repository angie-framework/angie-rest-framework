/**
 * @module Angie.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System Modules
import { $CustomResponse } from     '../node_modules/angie/dist/services/$Response';
import $Injector, {
    $$arguments
} from                              'angie-injector';

// Project Modules
import * as $Serializers from       './services/$Serializers';
import * as $Renderers from         './services/$Renderers';
import * as $Exceptions from        './services/$Exceptions';

const HTTP_METHODS = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'UPDATE',
    'PATCH'
];

// At this point, global.app needs to exist to invoke this
if (global.app && global.app.Controller) {
    const $APIRouteProvider = require('./factories/$APIRouteProvider');

    global.app.constant('HTTP_METHODS', HTTP_METHODS)
        .factory('$APIRoutes', $APIRouteProvider);
    global.app.controller = global.app.Controller = function(name, obj) {
        if (!(obj.prototype && obj.prototype.constructor)) {
            throw new $Exceptions.$$InvalidRESTfulControllerError(name);
        }
        return this.$$register('Controllers', name, controllerWrapper(name, obj));
    };
} else {

    // If it does not, we need to throw an error stopping the application's
    // invocation
    throw new $Exceptions.$$MissingParentModuleError();
}

/**
 * @desc The function called instead of the default Angie Controller
 * functionality. Instantiates the Controller class, checks for the `$request`
 * method on the instantiated Controller, and serializes/renders accordingly.
 * This function will offer default responses for "HEAD" and "OPTIONS" requests
 * and will handle invalid serialization and rendering responses.
 * @todo Extend $scope onto controller?
 * @access private
 * @since 0.0.1
 */
function controllerWrapper(name, obj) {
    return function($scope, $request, $response) {

        // Well...classes are kind of shitty sometimes
        // Keys on instantiated classes are non-enumerable...so
        // jscs:disable
        const controller = new obj($scope, $request, $response),
            method = $request.method;

        // jscs:enable

        if (/options|head/i.test(method)) {
            if ($request.method === 'OPTIONS') {
                $response.setHeader('Allow', HTTP_METHODS.filter(
                    (v) => !!controller[ v.toLowerCase() ]
                ).join(','));
            }
        } else if (typeof controller[ method.toLowerCase() ] === 'function') {
            return serialize(
                name,
                controller,
                $request
            ).then(function(b) {
                if (b) {
                    const RENDER = render.bind(
                        null, name, controller, $request, $response
                    );

                    // This is a workaround for binding context to the controller
                    // method
                    let controllerResponse = (function() {
                        const fn = controller[ method.toLowerCase() ];
                        let args = $Injector.get($$arguments(fn), 'Controller');
                        args = args instanceof Array ? args : [ args ];

                        // This, not a copy needs to be explicitly called
                        return controller[ method.toLowerCase() ](...args);
                    })();

                    // Handle async Controller method responses
                    if (controllerResponse &&
                        controllerResponse.prototype &&
                        controllerResponse.prototype.constructor === 'Promise'
                    ) {
                        return controllerResponse.then(function() {
                            return RENDER();
                        });
                    } else {
                        return RENDER();
                    }
                } else {

                    // Bad Data was provided to the method
                    new $CustomResponse().head(415, null);
                    return true;
                }
            }).then(function(b) {
                if (!b) {

                    // Rendered Improperly, we need to express it
                    new $CustomResponse().head(502, null);
                }
                $response.Controller.done(controller);
            });
        } else {

            // The method requested has not been exposed on the controller
            new $CustomResponse().head(405, null);
        }
    };
}

/**
 * @desc Finds serializers and performs data serialization
 * @access private
 * @since 0.0.1
*/
function serialize(name, controller, $request) {
    return Promise.resolve(
        $request[ $request.method === 'GET' ? 'query' : 'body' ]
    ).then(function(data) {

        // We have to serialize before we hit the method
        let serializers =
                controller.serializers ||
                controller.serializer ||
                $request.route.serializers ||
                $request.route.serializer ||
                global.app.$$config.defaultSerializers ||
                global.app.$$config.defaultSerializer,
            serializerValid = false;

        // If we have a single serializer
        if (typeof serializers === 'string') {
            serializers = [ serializers ];
        }

        // If not an Array at this point, our serializers are invalid
        if (!(serializers instanceof Array)) {
            throw new $Exceptions.$$InvalidSerializerConfiguration(name);
        } else {
            for (let serializer of serializers) {
                let serialized;
                if (
                    typeof serializer === 'string' &&
                    $Serializers.hasOwnProperty(serializer)
                ) {

                    // Call the serializer if it exists
                    serialized = new $Serializers[ serializer ](data);
                }

                if (serialized.valid) {

                    // Move the valid data on to `$request`.
                    $request.data = serialized.data;
                    serializerValid = true;

                    // Break on our first found valid serializer
                    break;
                }
            }
        }

        // Return serializer valid or invalid
        return serializerValid;
    });
}

/**
 * @desc Finds renderers and performs data rendering
 * @access private
 * @since 0.0.1
*/
function render(name, controller, $request, $response) {

    // Render the response data
    let renderer =
            controller.renderer ||
            $request.route.renderer ||
            global.app.$$config.defaultRenderer,
        rendered = {};

    // If no serializer found at this point, our renderer is invalid
    if (typeof renderer !== 'string') {
        throw new $Exceptions.$$InvalidRendererConfiguration(name);
    } else if ($Renderers.hasOwnProperty(renderer)) {

        // Call the renderer if it exists
        rendered = new $Renderers[ renderer ]($response.content);
    }

    if (rendered.valid) {

        // Write the data to the response if the renderer was successful
        $response.write(rendered.data);
        return true;
    }
    return false;
}

export {
    controllerWrapper as $$controllerWrapper,
    serialize as $$serialize,
    render as $$render
};