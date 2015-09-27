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

/**
 * @desc The basic renderer used to post process all response content which is
 * a byproduct of the RESTful route. The BaseRenderer alone clones "pre"
 * rendered data and invalidates the rendering. It also sets up the response
 * header associated with the renderer MIME type. If used alone, the response
 * will always be invalid. Nevertheless, this is a public class.
 * @todo pagination
 * @todo "GET" data display for all methods
 * @todo check "Accepts" to determine whether response will be well-received?
 * @access private
 * @since 0.0.1
 */
class BaseRenderer {

    /**
     * @desc Defines content type and sets up render
     * @access private
     * @since 0.0.1
     */
    constructor(data, dataType = 'text') {
        $Injector.get('$response').setHeader(
            'Content-Type',
            $MimeTypes.$$(dataType)
        );
        this.pre = data;
        this.valid = false;
    }
}

/**
 * @desc The renderer which describes responses that should return JSON data
 * with a MIME type of 'application/json'. Aliased as "json"
 * @extends {BaseRenderer}
 * @todo pagination
 * @todo "GET" data display for all methods
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     renderer: 'JSONRenderer'
 * });
 */
class JSONRenderer extends BaseRenderer {

    /**
     * @desc Renders JSON data and determines its validity
     * @access public
     * @since 0.0.1
     */
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

/**
 * @desc The renderer which describes responses that should return JSONP data
 * with a MIME type of 'application/javascript'. This renderer requires that a
 * callback name be defined in the serialized request data. Aliased as "jsonp"
 * @extends {BaseRenderer}
 * @todo pagination
 * @todo "GET" data display for all methods
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     renderer: 'JSONPRenderer'
 * });
 */
class JSONPRenderer extends JSONRenderer {

    /**
     * @desc Renders JSON data and determines its validity and wraps the data
     * in a user-defined global callback function by name.
     * @access public
     * @since 0.0.1
     */
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

/**
 * @desc The renderer which describes responses that should return XML data
 * with a MIME type of 'application/xml'. This renderer will assume all of the
 * responsibility of building an XML document from a JavaScript object. It will
 * not fill an XML template. Aliased as "xml"
 * @extends {BaseRenderer}
 * @todo pagination
 * @todo "GET" data display for all methods
 * @todo XMLTemplateRenderer/Schema renderers
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     renderer: 'XMLRenderer'
 * });
 */
class XMLRenderer extends BaseRenderer {

    /**
     * @desc Renders XML data
     * @access public
     * @since 0.0.1
     */
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

/**
 * @desc The renderer which describes responses that should return HTML data
 * with a MIME type of 'text/html'. Aliased as "html"
 * @extends {BaseRenderer}
 * @todo pagination
 * @todo "GET" data display for all methods
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     renderer: 'HTMLRenderer'
 * });
 */
class HTMLRenderer extends BaseRenderer {

    /**
     * @desc Renders HTML data
     * @access public
     * @since 0.0.1
     */
    constructor(data = '') {
        super(data, 'html');

        // This guy is basically the answer to HTML in this plugin
        // He just passes off the data to the route
        this.data = `${/doctype/i.test(data) ? '' : '<!DOCTYPE html>'}${data}`;
        this.valid = true;
    }
}

/**
 * @desc The renderer which describes responses that should return text data
 * with a MIME type of 'text/plain'. This renderer will always be valid. Aliased
 * as "text"
 * @extends {BaseRenderer}
 * @todo pagination
 * @todo "GET" data display for all methods
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     renderer: 'TextRenderer'
 * });
 */
class TextRenderer extends BaseRenderer {
    constructor(data = '') {
        super(data);

        this.data = data;
        this.valid = true;
    }
}

/**
 * @desc This is an alias of `TextRenderer`. Aliased as "raw"
 * @extends {TextRenderer}
 * @todo pagination
 * @todo "GET" data display for all methods
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     renderer: 'RawRenderer'
 * });
 */
class RawRenderer extends TextRenderer {}

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