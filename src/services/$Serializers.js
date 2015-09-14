/**
 * @module serializers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */

class BaseSerializer {
    constructor(data) {
        this.raw = data;
        this.valid = false;
    }
}

class JSONSerializer extends BaseSerializer {
    constructor(data) {
        super(data);
        if (typeof data !== 'object') {
            try {
                this.data = JSON.parse(data);
                this.valid = true;
            } catch(e) {
                throw new Error();
            }
        } else {
            this.valid = true;
        }
    }
}

class XMLSerializer extends BaseSerializer {}

class FormDataSerializer extends BaseSerializer {}

class TextSerializer extends BaseSerializer {}

export {
    JSONSerializer,
    JSONSerializer as json,
    XMLSerializer,
    XMLSerializer as xml,
    FormDataSerializer,
    FormDataSerializer as form,
    TextSerializer,
    TextSerializer as text
};