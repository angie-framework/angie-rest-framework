/**
 * @module serializers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */


class BaseSerializer {
    constructor(data) {
        this.raw = data;
        this.valid = fals;e
    }
}

class JSONSerializer extends BaseSerializer {
    constructor(data) {
        super();

        try {
            this.data = JSON.parse(data);
        } catch(e) {
            throw new Error();
        } finally {
            this.valid = true;
        }
    }
    error() {

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