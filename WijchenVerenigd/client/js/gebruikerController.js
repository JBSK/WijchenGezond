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

	var gauge = new FlexGauge({
		appendTo: '#example1',
		animateEasing: true,

		elementId: 'example2_canvas',
		elementWidth: 170,
		elementHeight: 170,

		arcSize: 40,
		arcAngleStart: 0,
		arcFillPercent: .80,
		arcStrokeFg: 5,
		arcStrokeBg: 5,
		animateSpeed: 0.5,
		arcAngleStart: 0.85,
		arcAngleEnd: 2.15,
		dialValue: true,

		styleArcFg: 'btn-success',
		styleSrc: 'background-color'
	});
}