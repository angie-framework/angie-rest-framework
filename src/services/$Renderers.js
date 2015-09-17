/**
 * @module renderers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System Modules
import XML from                         'xml-object'
import { default as $Injector } from    'angie-injector';

// Project Modules
import { default as $MimeTypes } from    '../../node_modules/angie/dist/util/$MimeTypeProvider.js';

const OPTS = {
    declaration: true,
    indent: true
};

class BaseRenderer {
    constructor(dataType = 'text', data) {
        $Injector.get('$response').setHeader(
            'Content-Type',
            $MimeTypes.$$(dataType)
        );
        this.pre = data;
        this.valid = false;
    }
}

class JSONRenderer extends BaseRenderer {
    constructor(data) {
        super('json', data);

        // If we're working with a string, we have to tests that it is a valid
        // JSON object
        try {
            if (typeof data === 'string') {

                // Just validate that this works
                this.data = JSON.parse(data);
            }
            this.data = JSON.stringify(this.data || data);
            this.valid = true;
        } catch(e) {}
    }
}

class JSONPRenderer extends JSONRenderer {
    constructor(data) {
        super(data);

        // Parent class MIME maps to json, we need js
        $Injector.get('$response').setHeader(
            'Content-Type',
            $MimeTypes.$$('js')
        );

        let cb = this.pre ? this.pre.callback || this.pre.cb : null;

        if (this.valid && cb) {
            this.data = `${cb}(${this.data});`;
        }
    }
}

class XMLRenderer extends BaseRenderer {
    constructor(data) {
        super('xml', data);

        try {
            this.data = XML(data, OPTS);
            this.valid = true;
        } catch(e) {}
    }
}

class HTMLRenderer extends BaseRenderer {
    constructor(data) {
        super('html', data);

        // This guy is basically the answer to HTML in this plugin
        // He just passes off the data to the route
        $Injector.get('$response').route.template = data;
    }
}

class TextRenderer extends BaseRenderer {
    constructor(data) {
        super(undefined, data);

        this.data = data;
        this.valid = true;
    }
}

class RawRenderer extends BaseRenderer {}

export {
    JSONRenderer,
    JSONRenderer as json,
    JSONPRenderer,
    JSONPRenderer as jsonp,
    XMLRenderer,
    XMLRenderer as xml,
    HTMLRenderer,
    HTMLRenderer as html,
    TextRenderer,
    TextRenderer as text,
    RawRenderer,
    RawRenderer as raw
};