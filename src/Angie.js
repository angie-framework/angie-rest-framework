/**
 * @module Angie.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System Modules
import util from                    'util';
// import {$CustomResponse} from       'angie/dist/services/$Response';
import {$injectionBinder} from      'angie-injector';

// Project Modules
import $APIRouteProvider from       './factories/$APIRouteProvider';
import * as $Serializers from       './services/$Serializers';
import * as $Renderers from         './services/$Renderers';
import * as $Exceptions from  './services/$Exceptions';

const HTTP_METHODS = [
    'HEAD',
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'UPDATE',
    'PATCH'
];

// At this point, global.app needs to exist to invoke this
if (global.app && global.app.Controller) {
    global.app.constant('HTTP_METHODS', HTTP_METHODS);
    global.app.factory('$APIRoutes', $APIRouteProvider);
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

        // Add data retrieval
        serialize(controller, $request);

        let methodResponse;
        if (/options/i.test(method)) {
            $response.setHeader('Allow', HTTP_METHODS.filter(
                (v) => !!controller[ v.toLowerCase() ]
            ).join(','));
        } else if (typeof controller[ method.toLowerCase() ] === 'function') {
            let controllerResponse = $injectionBinder(
                controller[ method.toLowerCase() ]
            ).call(controller);

            // Add data responder
            render(controller, $response);

            return controllerResponse;
        } else {
            return new $CustomResponse().head(405, null).write();
        }
    };
}

function serialize(controller, $request) {

    // We have to serialize before we hit the method
    let serializers = controller.serializer || $request.route.serializer ||
            global.app.$$config.defaultSerializers,
        serializerValid;
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
                serialized = new $Serializers[ serializer ];
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

    if (!serializerValid) {
        throw new $Exceptions.$$UnsuccessfulDataSerializationError();
    }
}

function render(controller, $response) {

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