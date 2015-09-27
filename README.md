![emblem](https://rawgit.com/angie-framework/angie/master/svg/angie.svg "emblem")

## Angie REST Framework
RESTful API wrapper around Angie Framework Application Endpoints

![build status](https://travis-ci.org/benderTheCrime/angie-rest-framework.svg?branch=master "build status")
![iojs support](https://img.shields.io/badge/iojs-1.7.1+-brightgreen.svg "iojs support")
![node support](https://img.shields.io/badge/node-0.12.0+-brightgreen.svg "node support")
![code coverage](https://rawgit.com/benderTheCrime/angie-rest-framework/master/svg/coverage.svg "code coverage")
![npm downloads](https://img.shields.io/npm/dm/angie-rest-framework.svg "npm downloads")

[![NPM](https://nodei.co/npm/angie-framework.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/angie-framework/)

## About
This package allows you to wrap your Angie application routes in endpoints specific to their RESTful methods. It includes many serializers to parse incoming data and renderers to parse outgoing data.

## Usage
This package does not ship with Angie by default. It is an extension of the included Angie application functionality.
```bash
npm i angie-rest-framework
```

*In your Angie application AngieFile.json, be sure to include the package as a dependency.*

Then, when you specify your Angie routes in a config:
```javascript
app.config(function($APIRoutes) {
    $APIRoutes.when('/test', {
        controller: 'TestController',
        serializers: [ 'JSONSerializer', 'XMLSerializer' ],
        renderer: 'JSONRenderer',
        template: 'test'
    });
});
```
The template included in the route above will not be rendered, Angie REST Framework does not support specifying routes in this fashion.

Next, we must define a controller. This is done in a similar fashion to Angie, but the `app.Controller` method is called with a class instead:
```javascript

class TestController {
    constructor($scope) {
        // ...do something with the $scope
    }
    get($request, $response) {
        // ...do something with $response.content;
    }
    post($request, TestModel) {
        // ...do something with posted data: $request.data
    }
}

app.Controller('TestController', TestController);
```
Injecting dependencies works very much the same way it does with regular controllers. You may also use the decorator provided with the injector to accomplish dependency injection in this fashion.

Based on the method of your request, your controller will now route the response through the declared methods on the instantiated controller and declare errors if data serialization fails, data rendering fails, or there is no declared method for the specified method. Errors will also be thrown if serializer or renderer classes cannot be found.

It is worth noting that "HEAD" and "OPTIONS" requests do not need to be declared. These requests return headers based on the request as specified they should by the HTTP spec.

For a list of Frequently Asked Questions, please see the [FAQ](https://github.com/angie-framework/angie-rest-framework/blob/master/FAQ.md "FAQ") and the [CHANGELOG](https://github.com/angie-framework/angie-rest-framework/blob/master/CHANGELOG.md "CHANGELOG") for an up to date list of changes. Contributors to this Project are outlined in the [CONTRIBUTORS](https://github.com/angie-framework/angie-rest-framework/blob/master/CONTRIBUTORS.md "CONTRIBUTORS") file.

### Angie
Please see the [site](http://benderthecrime.github.io/angie/) for information about the project, a quickstart guide, and documentation and the [CHANGELOG](https://github.com/angie-rest-framework/angie/blob/master/CHANGELOG.md) for an up to date list of changes.