/**
 * @module renderers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System Modules
import {default as $Injector} from     'angie-injector';

// Project Modules
import {default as $MimeTypes} from    '../../node_modules/angie/dist/util/$MimeTypeProvider.js';

class BaseRenderer {
    constructor(dataType = 'text', data) {
        const $response = $Injector.get('$response');
        $response.setHeader('Content-Type', $MimeTypes.$$(dataType));
        this.data = data;
        this.valid = false;
    }
}

class JSONRenderer extends BaseRenderer {
    constructor(data) {
        super('json', data);

        // This doesn't have an else block. If we can't stringify it something
        // is wrong
        if (typeof this.data !== 'string') {
            try {
                this.data = JSON.stringify(this.data);
                this.valid = true;
            } catch(e) {
                throw new Error();
            }
        }
    }
}

class JSONPRenderer extends BaseRenderer {}

class XMLRenderer extends BaseRenderer {}

// TODO this just sets the template
class HTMLRenderer extends BaseRenderer {}

export {
    JSONRenderer,
    JSONRenderer as json,
    JSONPRenderer,
    JSONPRenderer as jsonp,
    XMLRenderer,
    XMLRenderer as xml,
    HTMLRenderer,
    HTMLRenderer as html
};