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
    db.hoofdCategorieen = $resource("/categorieen/hoofdCategorieen/:_id", {}, actions);
    db.subCategorieen = $resource("/categorieen/subCategorieen/:_id", {}, actions);
    db.subHoofdCategorieen = $resource("/categorieen/hoofdCategorieen/subCategorieen/:_id", {}, actions);
    db.login = $resource("/gebruikers/login/", {}, actions);
    db.activiteiten = $resource("/activiteiten/", {}, actions);
    db.createGebruiker = $resource("/gebruikers/createGebruiker/",{},actions);
    db.createActiviteit = $resource("/activiteiten/",{},actions);
    db.meter = $resource("/meter/",{},actions);

    return db;
});

WijchenGezondApp.config(['$routeProvider', function ($routeProvider ) {
	$routeProvider.when('/', {
		templateUrl: '../views/home.html',
		controller: homeController
	});
    $routeProvider.when('/hoofdcategorieen/:_id', {
        templateUrl: '../views/hoofdCategorie.html',
        controller: hoofdCategorieController
    });
    $routeProvider.when('/categorieen', {
        templateUrl: '../views/categorieen.html',
        controller: categorieController
    });
    $routeProvider.when('/activiteit', {
        templateUrl: '../views/activiteit.html',
        controller: activiteitController
    });
    $routeProvider.when('/register/', {
        templateUrl: '../views/register.html',
        controller: gebruikerController
    });
    $routeProvider.when('/gebruikers/:_id', {
        templateUrl: '../views/gebruikersProfiel.html',
        controller: gebruikerController
    });
    $routeProvider.when('/feed/', {
        templateUrl: '../views/feed.html',
        controller: gebruikerController
    });
	$routeProvider.otherwise({
		redirectTo: "/"
	});
}]);