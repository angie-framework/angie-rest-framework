/**
 * @module $Serializers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System modules
import XML from                         'pixl-xml';
import { default as $Injector } from    'angie-injector';

/**
 * @desc The basic serializer used to pre process all request content which is
 * a byproduct of the RESTful route. The BaseSerializer alone clones "raw"
 * rendered data and invalidates the serialization. "GET" data will come from
 * the querystring associated with the request, while post body will come from
 * the passed request data. All form data will come from the parsed form
 * multipart data and be accessed as `$request.formData. If used alone, the
 * response will always be invalid. Nevertheless, this is a public class.
 * @todo Data validation
 * @access private
 * @since 0.0.1
 */
class BaseSerializer {

    /**
     * @desc Sets up serializer
     * @access private
     * @since 0.0.1
     */
    constructor(data) {
        this.raw = data;
        this.valid = false;
    }
}

/**
 * @desc The serializer which attempts to parse JSON requests. The serializer
 * will not perform a check on the data pre-serialization. Aliased as "json"
 * @extends {BaseSerializer}
 * @todo Data validation
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializer: 'JSONSerializer'
 * });
 * // or
 * $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializers: [ 'JSONSerializer' ]
 * });
 */
class JSONSerializer extends BaseSerializer {

    /**
     * @desc Performs validation on supposed JSON data and provides it to the
     * Controller if valid
     * @access private
     * @since 0.0.1
     */
    constructor(data) {
        super(data);

        try {
            if (typeof data === 'object') {

                // Just validate that this works
                data = JSON.stringify(data);
            }
            this.data = JSON.parse(data);
            this.valid = true;
        } catch(e) {}
    }
}

/**
 * @desc The serializer which attempts to parse XML requests. The serializer
 * will not perform a check on the data pre-serialization. The passed data will
 * be provided to the Controller as a JavaScript object. Aliased as "xml"
 * @extends {BaseSerializer}
 * @todo Data validation
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializer: 'XMLSerializer'
 * });
 * // or
 * $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializers: [ 'XMLSerializer' ]
 * });
 */
class XMLSerializer extends BaseSerializer {

    /**
     * @desc Performs validation on supposed XML data and provides it to the
     * Controller if valid
     * @access private
     * @since 0.0.1
     */
    constructor(data) {
        super(data);

        try {
            this.data = XML.parse(data);
            this.valid = true;
        } catch(e) {}
    }
}

/**
 * @desc The serializer which attempts to parse form data requests. The serializer
 * will perform a check on the data pre-serialization. This serializer will not
 * use any data passed in the body of the request. Only data passed as form or
 * multipart form will be used. Aliased as "form"
 * @extends {BaseSerializer}
 * @todo Data validation
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializer: 'FormDataSerializer'
 * });
 * // or
 * $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializers: [ 'FormDataSerializer' ]
 * });
 */
class FormDataSerializer extends BaseSerializer {

    /**
     * @desc Performs validation on supposed form data and provides it to the
     * Controller if valid
     * @access private
     * @since 0.0.1
     */
    constructor() {
        super();

        const $request = $Injector.get('$request'),
            formData = $request.formData;
        if (typeof formData === 'object' && Object.keys(formData).length) {
            this.data = formData;
            this.valid = true;
        }
    }
}

/**
 * @desc The serializer which attempts to parse text requests. The serializer
 * will not perform a check on the data pre-serialization. This serializer will
 * always be valid. Aliased as "text"
 * @extends {BaseSerializer}
 * @todo Data validation
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializer: 'TextSerializer'
 * });
 * // or
 * $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializers: [ 'TextSerializer' ]
 * });
 */
class TextSerializer extends BaseSerializer {

    /**
     * @desc Performs validation on text data and provides it to the
     * Controller if valid
     * @access private
     * @since 0.0.1
     */
    constructor(data) {
        super();
        this.data = data;
        this.valid = true;
    }
}

/**
 * @desc This is an alias of `TextSerializer`. Aliased as "raw"
 * @extends {TextSerializer}
 * @todo Data validation
 * @access public
 * @since 0.0.1
 * @example $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializer: 'RawSerializer'
 * });
 * // or
 * $APIRoutes.when('/test', {
 *     Controller: 'TestCtrl',
 *     serializers: [ 'RawSerializer' ]
 * });
 */
class RawSerializer extends TextSerializer {}

export {
    BaseSerializer as $$BaseSerializer,
    JSONSerializer,
    JSONSerializer as json,
    XMLSerializer,
    XMLSerializer as xml,
    FormDataSerializer,
    FormDataSerializer as form,
    TextSerializer,
    TextSerializer as text,
    RawSerializer,
    RawSerializer as raw
};