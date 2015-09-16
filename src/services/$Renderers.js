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

        console.log('DATA', data, typeof data);

        // If we're working with a string, we have to tests that it is a valid
        // JSON object
        try {
            if (typeof this.data === 'string') {

                // Just validate that this works
                this.data = JSON.parse(data);
            }
            this.data = JSON.stringify(data);
            this.valid = true;
        } catch(e) {}
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