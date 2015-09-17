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
import $Injector, {
    $injectionBinder,
    $$arguments
} from                              'angie-injector';
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

        // Extend scope onto the controller?
        // util._extend(controller, $scope);

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
                    const RENDER = render.bind(
                        null,
                        name,
                        controller,
                        $request,
                        $response
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

                    console.log('IMMA RENDER');

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

/*
 * @todo move data to request
 */
function serialize(name, controller, $request, $response) {
    return Promise.resolve(
        $request[ $request.method === 'GET' ? 'query' : 'body' ]
    ).then(function(data) {

        // We have to serialize before we hit the method
        let serializers = controller.serializers || controller.serializer ||
                $request.route.serializers || $request.route.serializer ||
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
                    serialized = new $Serializers[ serializer ](data);
                }

                if (serialized.valid) {
                    serializerValid = true;
                    break;
                }
            }
        }

        return serializerValid;
    });
}

function render(name, controller, $request, $response) {
    console.log('IN RENDER');

    // Render the response data
    let renderer = controller.renderer || $request.route.renderer ||
            global.app.$$config.defaultRenderers,
        rendered = {};

    console.log('RENDERER', renderer);

    if (typeof renderer !== 'string') {
        throw new $Exceptions.$$InvalidRendererConfiguration(name);
    } else if ($Renderers.hasOwnProperty(renderer)) {
        console.log('IN REDERERER');
        rendered = new $Renderers[ renderer ]($response.$content);
    }

    if (rendered.valid) {
        $response.write(rendered.data);
        return true;
    }
    return false;
}