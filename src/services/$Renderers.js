/**
 * @module renderers.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */


class BaseRenderer {}

class JSONRenderer extends BaseRenderer {}

class JSONPRenderer extends BaseRenderer {}

class XMLRenderer extends BaseRenderer {}

// TODO this just sets the template
class HTMLRenderer extends BaseRenderer {}

export {
    JSONRenderer,
    JSONPRenderer,
    XMLRenderer,
    HTMLRenderer
};