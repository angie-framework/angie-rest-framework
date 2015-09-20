/**
 * @module serializers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

// System modules
import XML from                         'pixl-xml';
import { default as $Injector } from    'angie-injector';

class BaseSerializer {
    constructor(data) {
        this.raw = data;
        this.valid = false;
    }
}

class JSONSerializer extends BaseSerializer {
    constructor(data) {
        super(data);

        try {
            if (typeof data === 'object') {

                // Just validate that this works
                this.data = JSON.stringify(data);
            }
            this.data = JSON.parse(this.data || data);
            this.valid = true;
        } catch(e) {}
    }
}

class XMLSerializer extends BaseSerializer {
    constructor(data) {
        super(data);

        try {
            this.data = XML.parse(data);
            this.valid = true;
        } catch(e) {}
    }
}

class FormDataSerializer extends BaseSerializer {
    constructor() {
        super();

        let formData;
        if (Object.keys(formData = $Injector.get('$request').formData).length) {
            this.data = formData;
            this.valid = true;
        }

    }
}

class TextSerializer extends BaseSerializer {
    constructor(data) {
        super();
        this.data = data;
        this.valid = true;
    }
}

class RawSerializer extends TextSerializer {}

export {
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