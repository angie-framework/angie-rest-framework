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

        console.log('IN SERIALIZER', data);

        try {
            if (typeof this.data === 'object') {

                // Just validate that this works
                this.data = JSON.stringify(data);
            }
            this.data = JSON.parse(data);
            this.valid = true;
        } catch(e) {}
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