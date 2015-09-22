/**
 * @module $APIRouteProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/12/2015
 */

// System Modules
import $Injector from   'angie-injector';

const $RouteProvider = $Injector.get('$Routes');

class $APIRouteProvider extends $RouteProvider {
    static when(p, obj) {

        console.log('SUPER', super.when);

        // We cannot have templates of any sort on the controllers
        delete obj.template;
        delete obj.templatePath;
        super.when(...arguments);
    }
}

export default $APIRouteProvider;
