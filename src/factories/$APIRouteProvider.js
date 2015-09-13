/**
 * @module $APIRouteProvider.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/12/2015
 */

// System Modules
import {default as $Injector} from 'angie-injector';
//import $RoutesProvider from     'angie/factories/$RoutesProvider';

const $RouteProvider = $Injector.get('$Routes');

class $APIRouteProvider extends $RouteProvider {
    static when(path, obj) {

        // We cannot have templates of any sort on the controllers
        delete obj.template;
        delete obj.templatePath;
        super.when.apply(this, arguments);
    }
}

export default $APIRouteProvider;
