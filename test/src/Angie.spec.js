// Test Modules
import { expect, assert } from      'chai';
import simple, { mock, spy } from   'simple-mock';

// System Modules
import $Injector from               'angie-injector';

// Catch existing exceptions
global.ANGIE_REST_FRAMEWORK_TEST_ENV = true;

// Angie REST Framework Modules
import { $CustomResponse } from     '../../node_modules/angie/dist/services/$Response';

const Angie =                       require(`../../${global.TEST_ENV}/Angie`);

describe('Angie', function() {
    describe('controllerWrapper', function() {
        let controllerClassSpy,
            request,
            setHeader,
            response,
            head;

        class Controller {
            constructor() {
                controllerClassSpy();
            }
            get() {

            }
            post() {

            }
        }

        beforeEach(function() {
            controllerClassSpy = spy();

            request = {
                method: 'GET'
            };

            setHeader = spy();
            response = { setHeader, $headers: {} };

            // mock(BaseResponse.prototype, 'constructor', function() {
            //     this.response = {};
            //     this.response.$headers = {};
            // });
            head = spy();
            mock($CustomResponse.prototype, 'constructor', function() {
                this.response.$headers = {};
                return { head };
            });
        });
        it('test options request returns exposed methods', function() {
            request.method = 'OPTIONS';
            Angie.$$controllerWrapper('test', Controller)({}, request, response);
            assert(controllerClassSpy.called);
            expect(
                setHeader.calls[0].args
            ).to.deep.eq([ 'Allow', 'GET,POST' ]);
        });
        it('test head request is pretty much useless', function() {
            request.method = 'HEAD';
            Angie.$$controllerWrapper('test', Controller)({}, request, response);
            assert(controllerClassSpy.called);
            assert(!setHeader.called);
        });
        xit('test 405 called when unexposed method is called', function() {
            request.method = 'PUT';
            Angie.$$controllerWrapper('test', Controller)({}, request, response);
            assert(controllerClassSpy.called);
            assert(!setHeader.called);
            assert($CustomResponse.prototype.constructor.called);
            assert(head.called);
        });
    });
    describe('render', function() {
        let request,
            write,
            setHeader,
            content,
            response;

        beforeEach(function() {
            global.app.$$config = {
                defaultRenderer: '$$BaseRenderer'
            };
            request = { route: {} };
            write = spy();
            setHeader = spy();
            content = { test: 'test' };
            response = { write, setHeader, content };
            mock($Injector, 'get', () => response);
        });
        afterEach(function() {
            delete global.app.$$config;
            simple.restore();
        });
        it('test no renderer specified throws exception', function() {
            delete global.app.$$config.defaultRenderer;
            expect(
                Angie.$$render.bind(null, 'test', {}, request, response)
            ).to.throw();
            assert(!setHeader.called);
            assert(!write.called);
        });
        it('test with Controller.renderer, unsuccessful', function() {
            expect(Angie.$$render(
                'test',
                {
                    renderer: '$$BaseRenderer'
                },
                request,
                response
            )).to.be.false;
            assert(setHeader.called);
            assert(!write.called);
        });
        it('test with request.route.render, unsuccessful', function() {
            request.route.renderer = '$$BaseRenderer';
            expect(Angie.$$render(
                'test',
                {},
                request,
                response
            )).to.be.false;
            assert(setHeader.called);
            assert(!write.called);
        });
        it('test with default app $$config renderer, unsuccessful', function() {
            expect(Angie.$$render(
                'test',
                {},
                request,
                response
            )).to.be.false;
            assert(setHeader.called);
            assert(!write.called);
        });
        it('test with Controller.renderer, successful', function() {
            expect(Angie.$$render(
                'test',
                {
                    renderer: 'TextRenderer'
                },
                request,
                response
            )).to.be.true;
            assert(setHeader.called);
            assert(write.called);
        });
        it('test with request.route.render, successful', function() {
            request.route.renderer = 'TextRenderer';
            expect(Angie.$$render(
                'test',
                {},
                request,
                response
            )).to.be.true;
            assert(setHeader.called);
            assert(write.called);
        });
        it('test with default app $$config renderer, successful', function() {
            global.app.$$config.defaultRenderer = 'TextRenderer';
            expect(Angie.$$render(
                'test',
                {},
                request,
                response
            )).to.be.true;
            assert(setHeader.called);
            assert(write.called);
        });
    });
    describe('serialize', function() {
        let content,
            request;

        beforeEach(function() {
            global.app.$$config = {
                defaultSerializers: [ '$$BaseSerializer' ]
            };
            content = { test: 'test' };
            request = {
                method: 'GET',
                route: {},
                query: content,
                body: '{"test":"test"}'
            };
        });
        afterEach(function() {
            delete global.app.$$config;
        });
        it('test no serializer throws an exception', function() {
            delete global.app.$$config.defaultSerializers;
            expect(Angie.$$serialize.bind(null, {}, {})).to.throw();
        });
        it('test object serializer throws an exception', function() {
            delete global.app.$$config.defaultSerializers;
            expect(Angie.$$serialize.bind(null, {
                serializer: {}
            }, request)).to.throw();
        });
        it('test with Controller.serializer, unsuccessful', function() {
            expect(Angie.$$serialize('test', {
                serializer: '$$BaseSerializer'
            }, request).val).to.be.false;
            expect(request.data).to.be.undefined;
        });
        it('test with Controller.serializers, unsuccessful', function() {
            expect(Angie.$$serialize('test', {
                serializers: [ '$$BaseSerializer' ]
            }, request).val).to.be.false;
            expect(request.data).to.be.undefined;
        });
        it('test with request.serializer, unsuccessful', function() {
            request.route.serializer = '$$BaseSerializer';
            expect(Angie.$$serialize('test', {}, request).val).to.be.false;
            expect(request.data).to.be.undefined;
        });
        it('test with request.serializers, unsuccessful', function() {
            request.route.serializers = [ '$$BaseSerializer' ];
            expect(Angie.$$serialize('test', {}, request).val).to.be.false;
            expect(request.data).to.be.undefined;
        });
        it('test with default app $$config serializer, unsuccessful', function() {
            delete global.app.$$config.defaultSerializers;
            global.app.$$config.defaultSerializer = [ '$$BaseSerializer' ];
            expect(Angie.$$serialize('test', {}, request).val).to.be.false;
            expect(request.data).to.be.undefined;
        });
        it('test with default app $$config serializers, unsuccessful', function() {
            global.app.$$config.defaultSerializers = [ '$$BaseSerializer' ];
            expect(Angie.$$serialize('test', {}, request).val).to.be.false;
            expect(request.data).to.be.undefined;
        });
        it('test with Controller.serializer, successful', function() {
            expect(Angie.$$serialize('test', {
                serializer: 'TextSerializer'
            }, request).val).to.be.true;
            expect(request.data).to.deep.eq(content);
        });
        it('test with Controller.serializers, successful', function() {
            expect(Angie.$$serialize('test', {
                serializers: [ 'TextSerializer' ]
            }, request).val).to.be.true;
            expect(request.data).to.deep.eq(content);
        });
        it('test with request.serializer, successful', function() {
            request.route.serializer = 'TextSerializer';
            expect(Angie.$$serialize('test', {}, request).val).to.be.true;
            expect(request.data).to.deep.eq(content);
        });
        it('test with request.serializers, successful', function() {
            request.route.serializers = [ 'TextSerializer' ];
            expect(Angie.$$serialize('test', {}, request).val).to.be.true;
            expect(request.data).to.deep.eq(content);
        });
        it('test with default app $$config serializer, successful', function() {
            delete global.app.$$config.defaultSerializers;
            global.app.$$config.defaultSerializer = 'TextSerializer';
            expect(Angie.$$serialize('test', {}, request).val).to.be.true;
            expect(request.data).to.deep.eq(content);
        });
        it('test with default app $$config serializers, successful', function() {
            global.app.$$config.defaultSerializers = [ 'TextSerializer' ];
            expect(Angie.$$serialize('test', {}, request).val).to.be.true;
            expect(request.data).to.deep.eq(content);
        });
        it('test with post data', function() {
            request.method = 'POST';
            global.app.$$config.defaultSerializers = [ 'JSONSerializer' ];
            expect(Angie.$$serialize('test', {}, request).val).to.be.true;
            expect(request.data).to.deep.eq(content);
        });
    });
});

// Test GET uses query POST uses body