// Test Modules
import { expect } from          'chai';
import simple, { mock } from    'simple-mock';

// Angie REST Framework Modules
const $APIRouteProvider =       require(`../../../${global.TEST_ENV}/factories/$APIRouteProvider`);

describe('$APIRouteProvider', function() {
    describe('when', function() {
        let route,
            whenMock;

        beforeEach(function() {
            route = {
                test: 'test',
                template: 'test',
                templatePath: 'test'
            };
            whenMock = mock(global.app.factories.$Routes, 'when', () => false);
        });
        afterEach(simple.restore);
        it('test $Route called', function() {
            $APIRouteProvider.when('test', route);
            expect(route.hasOwnProperty('template')).to.be.false;
            expect(route.hasOwnProperty('templatePath')).to.be.false;
            expect(whenMock.calls[0].args).to.deep.eq([ 'test', route ]);
        });
    });
});