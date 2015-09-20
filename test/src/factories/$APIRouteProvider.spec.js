// Test Modules
import { expect } from              'chai';
import simple, { mock, spy } from   'simple-mock';

// System Modules
import $Injector from               'angie-injector';

// Angie REST Framework Modules

describe('$APIRouteProvider', function() {
    describe('when', function() {
        let route,
            when,
            $APIRouteProvider;
        beforeEach(function() {
            route = {
                test: 'test',
                template: 'test',
                templatePath: 'test'
            };

            class Route {}
            when = spy(() => true);
            Route.when = when;

            mock($Injector, 'get', () => Route);
            $APIRouteProvider = require('../../../src/factories/$APIRouteProvider');
        });
        afterEach(simple.restore);
        it('test $Route called', function() {
            $APIRouteProvider.when('test', route);
            expect(route.hasOwnProperty('template')).to.be.false;
            expect(route.hasOwnProperty('templatePath')).to.be.false;
            expect(when.calls[0].args).to.deep.eq([ 'test', route ]);
        });
    });
});