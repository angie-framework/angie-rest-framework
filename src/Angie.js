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

// At this point, global.app needs to exist to invoke this
if (global.app && global.app.controller) {
    const controllerFn = global.app.controller;

    global.app.constant('HTTP_METHODS', [
        'HEAD',
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'UPDATE',
        'OPTIONS',
        'PATCH',
        'TRACE'
    ])
    global.app.Controller = function(name, obj) {
        if (!(obj.prototype && obj.prototype.constructor)) {
            throw new $$InvalidRESTfulControllerError(name);
        }
        return controllerFn.call(this, name, obj);
    };
} else {

    // If it does not, we need to throw an error stopping the application's
    // invocation
    throw new $$MissingParentModuleError();
}

// TODO wrap each controller invocation with a reference to the next controller up
function controllerWrapper($request) {
    //const

    if ($request.method) {}
    // TODO first check to see that the method is in the accepted rest Framework
    // methods for http requests

    // TODO then check to see that it exists in an instantiated controller
    // called with injection binder
}