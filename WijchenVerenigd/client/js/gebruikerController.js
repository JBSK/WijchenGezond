var gebruikerController = function ($routeParams, $scope, $window, dbService) {
	$scope.ingelogd = false;
	$scope.inlogMessage = "";
	$scope.checkLogin = function () {

	};
	$scope.login = function (gegevens) {
		dbService.login(gegevens, function(res) {
			inlogMessage = res.message;
		});
	};
	$scope.logout = function () {
		dbService.logout(function(res) {
			inlogMessage = res.message;
		});
	};

	$scope.registreer = function (gegevens) {
		dbService.registreer(gegevens, function (res) {
			inlogMessage = res.message;
		});
	}
}