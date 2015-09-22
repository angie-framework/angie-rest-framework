// Test Modules
import { expect, assert } from  'chai';
import { spy } from       'simple-mock';

// Then, catch existing exceptions
global.ANGIE_REST_FRAMEWORK_TEST_ENV = true;

// Angie REST Framework Modules
import * as Angie from  '../../src/Angie';

describe('Angie', function() {
    describe('$$render', function() {
        let write;

        beforeEach(function() {
            write = spy();
        });
        it('test no renderer specified throws exception', function() {
            expect(
                Angie.$$render.bind(null, 'test', {}, {}, { write })
            ).to.throw();
            assert(!write.called);
        });
    });
});

// test with invalid config
// test successful render
// test unsuccessful render
// test with controller render
// test with request render