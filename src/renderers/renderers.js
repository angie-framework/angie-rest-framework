/**
 * @module Angie.js
 * @author Joe Groseclose <@benderTheCrime>
 * @date 9/8/2015
 */


class BaseRenderer {}

class JSONRenderer extends BaseRenderer {}

class JSONPRenderer extends BaseRenderer {}

class XMLRenderer extends BaseRenderer {}

class HTMLRenderer extends BaseRenderer {}

export {
    JSONRenderer,
    JSONPRenderer,
    XMLRenderer,
    HTMLRenderer
};