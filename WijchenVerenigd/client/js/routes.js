"use strict";
var WijchenGezondApp = angular.module("WijchenGezondApp", ["ngResource"]);

WijchenGezondApp.service('dbService', function dbService($resource) {
    "use strict";
    var actions = {
            "get": {method: "GET"},
            "post": {method: "POST"},
            "update": {method: "PUT"},
            "query": {method: "GET", isArray: true},
            "delete": {method: "DELETE"}
        },
        db = {};
    db.gaVerder = $resource("/docent/gaVerder", {}, actions);
    db.sessie = $resource("/docent/sessie", {}, actions);
    db.vraag = $resource("/docent/vraag/:id", {}, actions);
    db.vragen = $resource("/docent/vragen/:id", {}, actions);
    return db;
});

WijchenGezondApp.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: '../views/home.html',
		controller: testController
	});
	$routeProvider.otherwise({
		redirectTo: "/"
	});
}]);