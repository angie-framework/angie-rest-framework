/**
 * @module Angie.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// Project Modules
import {
    $$MissingParentModuleError,
    $$InvalidRESTfulControllerError
} from  './services/$Exceptions';

const HTTP_METHODS = [
    'HEAD',
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'UPDATE',
    'OPTIONS',
    'PATCH',
    'TRACE'
];

// At this point, global.app needs to exist to invoke this
if (global.app && global.app.Controller) {
    // const controllerFn = global.app.Controller;

    global.app.constant('HTTP_METHODS', HTTP_METHODS);
    global.app.Controller = function(name, obj) {
        if (!(obj.prototype && obj.prototype.constructor)) {
            throw new $$InvalidRESTfulControllerError(name);
        }

        let controller = controllerWrapper(obj);

        // return controllerFn.call(this, name, obj);
        return this.$$register('Controllers', name, controller);
    };
} else {

    // If it does not, we need to throw an error stopping the application's
    // invocation
    throw new $$MissingParentModuleError();
}

// TODO wrap each controller invocation with a reference to the next controller up
function controllerWrapper(obj) {
    return function($request, $response, $CustomResponse) {
        const Controller = obj,
            method = $request.method;

        if (HTTP_METHODS.indexOf($request.method) > -1) {
            const controller = new $injectionBinder(Controller);

            if (
                controller.hasOwnProperty(method) &&
                typeof controller.method === 'function'
            ) {
                $injectionBinder(controller.method)();
            } else {
                new $CustomResponse().head(405, null).write();
            }
        }
    };


    // TODO then check to see that it exists in an instantiated controller
    // called with injection binder
}


