// Test Modules
import { expect, assert } from  'chai';
import simple, { mock } from    'simple-mock';

// System Modules
import { cyan } from            'chalk';
import $LogProvider from        'angie-log';

// Angie REST Framework Modules
const $Exceptions =             require('../../../src/services/$Exceptions');

describe('$Exceptions', function() {
    beforeEach(function() {
        mock($LogProvider, 'error', () => false);
    });
    afterEach(simple.restore);
    describe('$$MissingParentModuleError', function() {
        describe('constructor', function() {
            afterEach(function() {
                global.ANGIE_REST_FRAMEWORK_TEST_ENV = true;
            });
            it('test global test env setting', function() {
                global.ANGIE_REST_FRAMEWORK_TEST_ENV = false;
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$MissingParentModuleError();

                    /* eslint-enable */
                }).to.throw();
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    'Angie REST Framework cannot be used outside Angie ' +
                    'dependency modules'
                );
            });
            it('test no global test env setting', function() {
                expect((function() {

                    /* eslint-disable */
                    return new $Exceptions.$$MissingParentModuleError();

                    /* eslint-enable */
                })()).to.deep.eq({});
                assert(!$LogProvider.error.called);
            });
        });
    });
    describe('$$InvalidRESTfulControllerError', function() {
        describe('constructor', function() {
            it('test without name', function() {
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$InvalidRESTfulControllerError();

                    /* eslint-enable */
                }).to.throw();
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `Invalid configuration for Controller ${cyan('')}: ` +
                    'Controller must be a valid JavaScript class with a ' +
                    'constructor'
                );
            });
            it('test with name', function() {
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$InvalidRESTfulControllerError('test');

                    /* eslint-enable */
                }).to.throw();
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `Invalid configuration for Controller ${cyan('test')}: ` +
                    'Controller must be a valid JavaScript class with a ' +
                    'constructor'
                );
            });
        });
    });
    describe('$$InvalidSerializerConfiguration', function() {
        describe('constructor', function() {
            it('test without name', function() {
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$InvalidSerializerConfiguration();

                    /* eslint-enable */
                }).to.throw();
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `No serializers specified for Controller ${cyan('')}`
                );
            });
            it('test with name', function() {
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$InvalidSerializerConfiguration('test');

                    /* eslint-enable */
                }).to.throw();
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `No serializers specified for Controller ${cyan('test')}`
                );
            });
        });
    });
    describe('$$InvalidRendererConfiguration', function() {
        describe('constructor', function() {
            it('test without name', function() {
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$InvalidRendererConfiguration();

                    /* eslint-enable */
                }).to.throw();
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `No renderer specified for Controller ${cyan('')}`
                );
            });
            it('test with name', function() {
                expect(function() {

                    /* eslint-disable */
                    new $Exceptions.$$InvalidRendererConfiguration('test');

                    /* eslint-enable */
                }).to.throw();
                expect($LogProvider.error.calls[0].args[0]).to.eq(
                    `No renderer specified for Controller ${cyan('test')}`
                );
            });
        });
    });
});