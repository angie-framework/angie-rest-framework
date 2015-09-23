/**
 * @module $Renderers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System Modules
import XML from                         'xml-object';
import { default as $Injector } from    'angie-injector';

// Project Modules
import { default as $MimeTypes } from    '../../node_modules/angie/dist/util/$MimeTypeProvider';

const OPTS = {
    declaration: true,
    indent: true
};

class BaseRenderer {
    constructor(data, dataType = 'text') {
        $Injector.get('$response').setHeader(
            'Content-Type',
            $MimeTypes.$$(dataType)
        );
        this.pre = data;
        this.valid = false;
    }
}

class JSONRenderer extends BaseRenderer {
    constructor(data = '') {
        super(data, 'json');

        // If we're working with a string, we have to tests that it is a valid
        // JSON object
        try {
            if (typeof data === 'string') {

                // Just validate that this works
                data = JSON.parse(data);
            }
            this.data = JSON.stringify(data);
            this.valid = true;
        } catch(e) {}
    }
}

class JSONPRenderer extends JSONRenderer {
    constructor(data = '') {
        super(data);

        // Parent class MIME maps to json, we need js
        $Injector.get('$response').setHeader(
            'Content-Type',
            $MimeTypes.$$('js')
        );

        // Extract the callback name for the request
        let cb = this.pre ? this.pre.callback || this.pre.cb : null;
        if (this.valid && cb) {
            this.data = `${cb}(${this.data});`;
        } else {
            delete this.data;
            this.valid = false;
        }
    }
}

class XMLRenderer extends BaseRenderer {
    constructor(data = '') {
        super(data, 'xml');

        try {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            this.data = XML(data, OPTS);
            this.valid = true;
        } catch(e) {}
    }
}

class HTMLRenderer extends BaseRenderer {
    constructor(data = '') {
        super(data, 'html');

        // This guy is basically the answer to HTML in this plugin
        // He just passes off the data to the route
        this.data = `${/doctype/i.test(data) ? '' : '<!DOCTYPE html>'}${data}`;
        this.valid = true;
    }
}

class TextRenderer extends BaseRenderer {
    constructor(data = '') {
        super(data);

        this.data = data;
        this.valid = true;
    }
}

class RawRenderer extends BaseRenderer {}

export {
    BaseRenderer as $$BaseRenderer,
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