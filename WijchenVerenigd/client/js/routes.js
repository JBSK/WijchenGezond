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
    db.addDeelnemer = $resource("/activiteiten/addDeelnemer",{},actions);
    db.verwijderDeelnemer = $resource("/activiteiten/verwijderDeelnemer",{},actions);
    db.meter = $resource("/meter/",{},actions);
    db.feeds = $resource("/feeds/:soort",{},actions);
    db.react = $resource("/feeds/feeds",{},actions);
    db.gebruiker = $resource("/gebruikers/gebruiker/:_id", {}, actions);
    db.volg = $resource("/gebruikers/addVriend/", {}, actions);
    db.ontVolg = $resource("/gebruikers/delVriend/", {}, actions);
    db.volgers = $resource("/gebruikers/getVrienden/:_id", {}, actions);
    db.volgend = $resource("/gebruikers/zoekVrienden/:_id", {}, actions);

    db.feedsGebruiker = $resource("/feeds/feeds/gebruiker/:_id", {}, actions);
    db.feedsGebruikerVrienden = $resource("/feeds/feeds/:_id", {}, actions);

    return db;
});

WijchenGezondApp.service('loginService', function loginService($rootScope) {
    "use strict";
    var service = {};
    service.showLogin = false;
    service.loggedIn = false;

    service.setLoggedIn = function (value) {
        service.loggedIn = value;
        $rootScope.$broadcast("loggedInUpdated");
    } 

    service.setLogin = function (value) {
        service.showLogin = value;
        $rootScope.$broadcast("loginUpdated");
    }

    return service;
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
        controller: profielController
    });
    $routeProvider.when('/feed/', {
        templateUrl: '../views/feed.html',
        controller: feedsController
    });
	$routeProvider.otherwise({
		redirectTo: "/"
	});
}]);