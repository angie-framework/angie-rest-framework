/**
 * @module $APIRouteProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/12/2015
 */

// System Modules
import $Injector from   'angie-injector';

const $RouteProvider = $Injector.get('$Routes');

/**
 * @desc $APIRouteProvider is an abstraction on top of the default Angie
 * $RouteProvider. It is included as "$APIRoutes" and has the same functionality
 * as $Routes with the exception that it prevents the inclusion of the `template`
 * and `templatePath` properties in the declaration of application routes. These
 * properties make no sense in the RESTful world.
 * @extends {$RouteProvider}
 * @todo use Symbols for RegExp store
 * @access public
 * @since 0.0.1
 */
class $APIRouteProvider extends $RouteProvider {

    /**
     * @desc An alias of the $RouteProvider.when method
     * @since 0.0.1
     * @param {string|Object} str String or RegExp to denote the endpoint
     * path
     * @param {Object} obj
     * @param {?string} obj.templatePath Optional template path
     * @param {?string} obj.template Optional template html
     * @param {?string} obj.Controller The name of the associated Controller
     * @param {?object} obj.* A deep route with another route object
     * to associate with a route consisting of the original path added to the
     * new key
     * @returns {function} Template function, compiles in whatever scope is
     * passed
     * @access public
     * @example $APIRoutes.when('/test', {
     *     Controller: 'TestCtrl',
     *     test2: {
     *         Controller: 'Test2Ctrl'
     *     }
     * });
     */
    static when(p, obj) {

        // We cannot have templates of any sort on the controllers
        delete obj.template;
        delete obj.templatePath;
        super.when(...arguments);
    }
}

export default $APIRouteProvider;
