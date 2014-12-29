var homeController = function ($routeParams, $scope, $window, dbService, $location, loginService) {
	$scope.activiteiten = [];
	$scope.predicate = 'datum';
	$scope.gebruikerLogin = {};

	var checkLogin = function () {
		dbService.login.get(function(res) {
			if (res.success) {
				$scope.gebruikerLogin = res.data;
			} else {
				console.log("Je bent niet ingelogd.");
			}
		});
	};
	checkLogin();

	var getActiviteiten = function () {
		dbService.activiteiten.get(function (res) {
			if (res.success) {
				$scope.activiteiten = res.data;
				$scope.deelnemenOfAfmelden($scope);
			}
		});
	}
	getActiviteiten();

	$scope.$on('loggedInUpdated', function() {
		dbService.login.get(function(res) {
			if (res.success) {
				$scope.gebruikerLogin = res.data;
				getActiviteiten();
			} else {
				//console.log("Je bent niet ingelogd.");
			}
		});
	});

	$scope.hoverIn = function(){
    	this.hoverEdit = true;
	};

	$scope.hoverOut = function(){
	    this.hoverEdit = false;
	};

	$scope.deelnemen = function (actId, doa) {
		var newDeelnemen = {};
		var makeAndSend = function () {
			newDeelnemen.activiteitId = actId;
			newDeelnemen._id = $scope.gebruikerLogin._id;
			if (doa === "Deelnemen") {
				dbService.addDeelnemer.post(newDeelnemen, function (res) {
					if (res.success) {
						getActiviteiten();
					}
				});
			} else if (doa === "Afmelden") {
				dbService.verwijderDeelnemer.post(newDeelnemen, function (res) {
					if (res.success) {
						getActiviteiten();
					}
				});
			}
		}
		var checkLogin = function () {
			dbService.login.get(function(res) {
				if (res.success) {
					$scope.gebruikerLogin = res.data;
					makeAndSend();
				} else {
					loginService.setLogin(true);
				}
			});
		};
		checkLogin();
	}

	$scope.deelnemenOfAfmelden = function (deelnemers) {
		var i;
		if ($scope.gebruikerLogin._id) {
			for (i = 0; i < deelnemers.length; i += 1) {
				if (deelnemers[i]._id === $scope.gebruikerLogin._id) {
					return "Afmelden";
				}
			}
		}
		return "Deelnemen";
	}
};