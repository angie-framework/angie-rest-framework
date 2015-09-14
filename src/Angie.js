/**
 * @module Angie.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System Modules
import util from                    'util';
import {
    $ErrorResponse,
    $CustomResponse
} from                              '../node_modules/angie/dist/services/$Response';
import {$injectionBinder} from      'angie-injector';
import $LogProvider from            'angie-log';

// Project Modules
import $APIRouteProvider from       './factories/$APIRouteProvider';
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
    global.app
        .constant('HTTP_METHODS', HTTP_METHODS)
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

// TODO wrap each controller invocation with a reference to the next controller up
function controllerWrapper(name, obj) {
    const serializerNames = Object.keys($Serializers),
        rendererNames = Object.keys($Renderers);
    return function($scope, $request, $response) {

        // Well...classes are kind of shitty sometimes
        // Keys on instantiated classes are non-enumerable...so
        const controller = new obj($scope, $request, $response),
            method = $request.method;

        util._extend(controller, $scope);

        let methodResponse;
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
                $request,
                $response
            ).then(function(b) {
                if (b) {

                    // TODO why can't you bind?
                    let controllerResponse = $injectionBinder(
                        controller[ method.toLowerCase() ]
                    ).call(controller);

                    // TODO write data to the response

                    // Add data responder
                    return render(name, controller, $request, $response);
                } else {

                    // Write Bad Data
                    new $CustomResponse().head(415, null);
                    return true;
                }
            }).then(function(b) {
                if (b) {
                    $response.Controller.done(controller);
                } else {

                    // Rendered Improperly
                    new $CustomResponse().head(502, null);
                }

            }).catch(function(e) {
                return new $ErrorResponse(e).head();
            });
        } else {
            return new $CustomResponse().head(405, null);
        }
    };
}

function serialize(name, controller, $request, $response) {
    return new Promise(function(resolve, reject) {
        let data = $request.body = $request.query;
        if ($request.method !== 'GET') {
            $request.body = '';
            $request.on('data', function(d) {
                data += d;
                if (data.length > 1E6) {
                    $request.connection.destroy();
                    reject();
                }
            });
            $request.on('end', () => resolve(data));
        } else {
            resolve(data);
        }
    }).then(function(data) {

        // We have to serialize before we hit the method
        let serializers = controller.serializers || controller.serializer ||
                $request.route.serializers || $request.route.serializer ||
                global.app.$$config.defaultSerializers,
            serializerValid;
        console.log(serializers);
        if (typeof serializers === 'string') {
            serializers = [ serializers ];
        }

        if (!(serializers instanceof Array)) {
            throw new $Exceptions.$$InvalidSerializerConfiguration(name);
        } else {
            for (let serializer of serializers) {
                let serialized;
                if (
                    typeof serializer === 'string' &&
                    $Serializers.hasOwnProperty(serializer)
                ) {
                    console.log(serializer);
                    serialized = new $Serializers[ serializer ](data);
                } else {
                    throw new $Exceptions.$$UnsuccessfulDataSerializationError(
                        serializer
                    );
                }

                if (serialized.valid) {
                    serializerValid = true;
                    break;
                }
            }
        }


        // TODO reject the promise here and throw an Invalid Data custom response
        if (!serializerValid) {
            return false;
        }

        return true;
    });
}

function render(name, controller, $request, $response) {

    // Render the response data
    let renderers = controller.renderer || $request.route.renderer ||
            global.app.$$config.defaultRenderers,
        rendererValid;
    if (!(renderers instanceof Array)) {
        throw new $Exceptions.$$InvalidRendererConfiguration(name);
    } else {
        for (let renderer of renderers) {
            let rendered;
            if (
                typeof renderer === 'string' &&
                $Renderers.hasOwnProperty(renderer)
            ) {
                rendered = new $Renderers[ renderer ];
            } else {
                throw new $Exceptions.$$UnsuccessfulDataRenderingError(
                    renderer
                );
            }

            if (renderer.valid) {
                rendererValid = true;
                break;
            }
        }
    }

    if (!rendererValid) {
        throw new $Exceptions.$$UnsuccessfulDataRenderingError();
    }
}