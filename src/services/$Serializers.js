/**
 * @module serializers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */


class BaseSerializer {}

class JSONSerializer extends BaseSerializer {}

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