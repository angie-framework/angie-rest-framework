// Test Modules
import { expect } from              'chai';
import simple, { mock, spy } from   'simple-mock';

// System Modules
import $Injector from               'angie-injector';

// Angie REST Framework Modules
const $Renderers =                  require(`../../../${global.TEST_ENV}/services/$Renderers`);

describe('$Renderers', function() {
    let setHeader;

    beforeEach(function() {
        setHeader = spy();
        mock($Injector, 'get', function() {
            return { setHeader };
        });
    });
    afterEach(simple.restore);
    describe('BaseRenderer', function() {
        describe('contructor', function() {
            it('test without dataType', function() {
                const base = new $Renderers.$$BaseRenderer('test');
                expect(
                    setHeader.calls[0].args
                ).to.deep.eq([ 'Content-Type', 'text/plain' ]);
                expect(base.pre).to.eq('test');
                expect(base.valid).to.be.false;
            });
            it('test with dataType', function() {
                const base = new $Renderers.$$BaseRenderer('test', 'xml');
                expect(
                    setHeader.calls[0].args
                ).to.deep.eq([ 'Content-Type', 'application/xml' ]);
                expect(base.pre).to.eq('test');
                expect(base.valid).to.be.false;
            });
        });
    });
    describe('JSONRenderer', function() {
        describe('constructor', function() {
            it('test parser error', function() {
                const json = new $Renderers.JSONRenderer('}{');
                expect(
                    setHeader.calls[0].args
                ).to.deep.eq([ 'Content-Type', 'application/json' ]);
                expect(json.hasOwnProperty('data')).to.be.false;
                expect(json.valid).to.be.false;
            });
            it('test passed string', function() {
                const json = new $Renderers.JSONRenderer('{"test":"test"}');
                expect(
                    setHeader.calls[0].args
                ).to.deep.eq([ 'Content-Type', 'application/json' ]);
                expect(json.data).to.eq('{"test":"test"}');
                expect(json.valid).to.be.true;
            });
            it('test passed object', function() {
                const json = new $Renderers.JSONRenderer({ test: 'test' });
                expect(
                    setHeader.calls[0].args
                ).to.deep.eq([ 'Content-Type', 'application/json' ]);
                expect(json.data).to.eq('{"test":"test"}');
                expect(json.valid).to.be.true;
            });
        });
    });
    describe('JSONPRenderer', function() {
        describe('constructor', function() {
            it('test no callback found', function() {
                const json = new $Renderers.JSONPRenderer('{"test":"test"}');
                expect(
                    setHeader.calls[1].args
                ).to.deep.eq([ 'Content-Type', 'application/javascript' ]);
                expect(json.hasOwnProperty('data')).to.be.false;
                expect(json.valid).to.be.false;
            });
            it('test not valid data in Super', function() {
                const json = new $Renderers.JSONPRenderer('}{}');
                expect(
                    setHeader.calls[1].args
                ).to.deep.eq([ 'Content-Type', 'application/javascript' ]);
                expect(json.hasOwnProperty('data')).to.be.false;
                expect(json.valid).to.be.false;
            });
            it('test cb', function() {
                const json = new $Renderers.JSONPRenderer({ cb: 'cb' });
                expect(
                    setHeader.calls[1].args
                ).to.deep.eq([ 'Content-Type', 'application/javascript' ]);
                expect(json.data).to.eq('cb({"cb":"cb"});');
                expect(json.valid).to.be.true;
            });
            it('test callback', function() {
                const json = new $Renderers.JSONPRenderer({
                    callback: 'callback'
                });
                expect(
                    setHeader.calls[1].args
                ).to.deep.eq([ 'Content-Type', 'application/javascript' ]);
                expect(json.data).to.eq('callback({"callback":"callback"});');
                expect(json.valid).to.be.true;
            });
        });
        describe('XMLRenderer', function() {
            describe('constructor', function() {
                it('test XML parser error', function() {
                    const xml = new $Renderers.XMLRenderer('}{');
                    expect(
                        setHeader.calls[0].args
                    ).to.deep.eq([ 'Content-Type', 'application/xml' ]);
                    expect(xml.hasOwnProperty('data')).to.be.false;
                    expect(xml.valid).to.be.false;
                });
                it('test successful XML render with string', function() {
                    const xml = new $Renderers.XMLRenderer('{"test":"test"}');
                    expect(
                        setHeader.calls[0].args
                    ).to.deep.eq([ 'Content-Type', 'application/xml' ]);
                    expect(xml.data).to.eq(
                        '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n' +
                        '<test>test</test>'
                    );
                    expect(xml.valid).to.be.true;
                });
                it('test successful XML render with object', function() {
                    const xml = new $Renderers.XMLRenderer({ test: 'test' });
                    expect(
                        setHeader.calls[0].args
                    ).to.deep.eq([ 'Content-Type', 'application/xml' ]);
                    expect(xml.data).to.eq(
                        '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n' +
                        '<test>test</test>'
                    );
                    expect(xml.valid).to.be.true;
                });
            });
        });
        describe('HTMLRenderer', function() {
            describe('constructor', function() {
                it('test successful HTML render without DOCTYPE', function() {
                    const html = new $Renderers.HTMLRenderer('<div></div>');
                    expect(
                        setHeader.calls[0].args
                    ).to.deep.eq([ 'Content-Type', 'text/html' ]);
                    expect(html.data).to.eq('<!DOCTYPE html><div></div>');
                    expect(html.valid).to.be.true;
                });
                it('test successful HTML render with DOCTYPE', function() {
                    const html = new $Renderers.HTMLRenderer(
                        '<!DOCTYPE html><div></div>'
                    );
                    expect(
                        setHeader.calls[0].args
                    ).to.deep.eq([ 'Content-Type', 'text/html' ]);
                    expect(html.data).to.eq('<!DOCTYPE html><div></div>');
                    expect(html.valid).to.be.true;
                });
            });
        });
        describe('TextRenderer', function() {
            describe('constructor', function() {
                it('test successful text render', function() {
                    const text = new $Renderers.TextRenderer('test');
                    expect(
                        setHeader.calls[0].args
                    ).to.deep.eq([ 'Content-Type', 'text/plain' ]);
                    expect(text.data).to.eq('test');
                    expect(text.valid).to.be.true;
                });
            });
        });
    });
});