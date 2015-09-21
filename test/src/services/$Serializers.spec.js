// Test Modules
import { expect } from          'chai';
import simple, { mock } from    'simple-mock';

// System Modules
import $Injector from               'angie-injector';

// Angie REST Framework Modules
const $Serializers =            require('../../../src/services/$Serializers');

describe('$Serializers', function() {
    const data = { test: 'test' };

    describe('BaseSerializer', function() {
        it('constructor', function() {
            const base = new $Serializers.BaseSerializer(data);
            expect(base.raw).to.eq(data);
            expect(base.valid).to.be.false;
        });
    });
    describe('JSONSerializer', function() {
        describe('constructor', function() {
            it('test parser error', function() {
                const json = new $Serializers.JSONSerializer('}{');
                expect(json.hasOwnProperty('data')).to.be.false;
                expect(json.valid).to.be.false;
            });
            it('test passed object', function() {
                const json = new $Serializers.JSONSerializer(data);
                expect(json.data).to.deep.eq(data);
                expect(json.valid).to.be.true;
            });
            it('test passed string', function() {
                const json = new $Serializers.JSONSerializer('{"test":"test"}');
                expect(json.data).to.deep.eq(data);
                expect(json.valid).to.be.true;
            });
        });
    });
    describe('XMLSerializer', function() {
        describe('constructor', function() {
            it('test passed erroneous XML', function() {
                const xml = new $Serializers.XMLSerializer(
                    '<?xml version=\"1.0\" encoding=\"UTF-8\"?><document>' +
                    '<test>test</test></document'
                );
                expect(xml.hasOwnProperty('data')).to.be.false;
                expect(xml.valid).to.be.false;
            });
            it('test passed proper XML', function() {
                const xml = new $Serializers.XMLSerializer(
                    '<?xml version=\"1.0\" encoding=\"UTF-8\"?><document>' +
                    '<test>test</test></document>'
                );
                expect(xml.data).to.deep.eq(data);
                expect(xml.valid).to.be.true;
            });
        });
    });
    describe('FormDataSerializer', function() {
        let injectorMock;

        describe('constructor', function() {
            beforeEach(function() {
                injectorMock = mock($Injector, 'get', function() {
                    return { formData: data };
                });
            });
            afterEach(simple.restore);
            it('test without request form data', function() {
                injectorMock.returnWith({});
                let form = new $Serializers.FormDataSerializer();
                expect(form.hasOwnProperty('data')).to.be.false;
                expect(form.valid).to.be.false;
            });
            it('test with non-object request form data', function() {
                injectorMock.returnWith({ formData: '' });
                let form = new $Serializers.FormDataSerializer();
                expect(form.hasOwnProperty('data')).to.be.false;
                expect(form.valid).to.be.false;
            });
            it('test with empty request form data', function() {
                injectorMock.returnWith({ formData: {} });
                let form = new $Serializers.FormDataSerializer();
                expect(form.hasOwnProperty('data')).to.be.false;
                expect(form.valid).to.be.false;
            });
            it('test with request form data', function() {
                let form = new $Serializers.FormDataSerializer();
                expect(form.data).to.deep.eq(data);
                expect(form.valid).to.be.true;
            });
        });
    });
    describe('TextSerializer', function() {
        it('constructor', function() {
            const text = new $Serializers.TextSerializer('test');
            expect(text.data).to.eq('test');
            expect(text.valid).to.be.true;
        });
    });
});