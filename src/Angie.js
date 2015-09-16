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
import {
    default as $Injector,
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
                console.log('B', b);
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
                        const fn = controller[ method.toLowerCase() ],
                            args = $Injector.get.apply(null, $$arguments(fn));

                        // This, not a copy needs to be explicitly called
                        return controller[ method.toLowerCase() ](...args);
                    })();

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

                    console.log('NIIII');

                    // Bad Data was provided to the method
                    new $CustomResponse().head(415, null);
                    console.log('AFREE');
                    return true;
                }
            }).then(function(b) {
                console.log('BB', b);
                if (!b) {

                    // Rendered Improperly, we need to express it
                    // TODO bad data, should return nothing
                    // $response.$content = undefined;
                    new $CustomResponse().head(502, null);
                }
                $response.Controller.done(controller);
            })
        } else {

            // The method requested has not been exposed on the controller
            new $CustomResponse().head(405, null);
            $response.Controller.done(controller);
        }
    };
}

/*
 * @todo move data to request
 */
function serialize(name, controller, $request, $response) {
    return new Promise(function(resolve, reject) {
        console.log('IN SERIALIZE');
        resolve($request[ $request.method === 'GET' ? 'query' : 'body' ]);
    }).then(function(data) {

        console.log('DATA TEST', data);

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
                    console.log('serializer', serializer);
                    serialized = new $Serializers[ serializer ](data);
                }

                console.log('SERIALIZED', serialized);

                if (serialized.valid) {
                    serializerValid = true;
                    break;
                }
            }
        }

        if (serializerValid) {
            console.log('VALID');
            return true;
        }
        console.log('INVALID');
        return false;
    });
}

function render(name, controller, $request, $response) {

    // Render the response data
    let renderers = controller.renderer || $request.route.renderer ||
            global.app.$$config.defaultRenderers,
        rendererValid,
        rendered;
    if (typeof renderers === 'string') {
        renderers = [ renderers ];
    }

    if (!(renderers instanceof Array)) {
        throw new $Exceptions.$$InvalidRendererConfiguration(name);
    } else {
        for (let renderer of renderers) {
            if (
                typeof renderer === 'string' &&
                $Renderers.hasOwnProperty(renderer)
            ) {
                rendered = new $Renderers[ renderer ]($response.$content);
            }

            if (rendered.valid) {
                rendererValid = true;
                break;
            }
        }
    }

    if (rendererValid) {
        $response.write(rendered.data);
        return true;
    }
    return false;
}