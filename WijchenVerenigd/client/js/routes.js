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
    db.login = $resource("/gebruikers/login", {}, actions);
    db.createGebruiker = $resource("/gebruikers/createGebruiker",{},actions);
    db.createActiviteit = $resource("/activiteiten/",{},actions);

    return db;
});

//function ($routeParams, $scope, $modal, $window, dbService) {
//    $scope.log = function () {
//        console.log("popup");
//        $modal.open();
//    }
//};

WijchenGezondApp.controller('indexController', function ($scope, dbService,$location, $route, $routeParams) {

    $scope.log = function (data) {
        dbService.login.post(data,function(res) {
           // console.log(res);
            if(res.message === "Alles klopt.")
            {
                 console.log(data)

                $location.path('/gebruikers/' + res.data._id);
                $scope.selection = "login";
            }
        });
    };
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
    $routeProvider.when('/activiteit/:_id', {
        templateUrl: '../views/activiteit.html',
        controller: activiteitController
    });
    $routeProvider.when('/login/', {
        templateUrl: '../views/login.html',
        controller: gebruikerController
    });
    $routeProvider.when('/gebruikers/:_id', {
        templateUrl: '../views/gebruikersProfiel.html',
        controller: gebruikerController
    });
	$routeProvider.otherwise({
		redirectTo: "/"
	});
}]);