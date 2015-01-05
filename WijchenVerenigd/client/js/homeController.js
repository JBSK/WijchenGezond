var homeController = function ($routeParams, $scope, $window, dbService, $location, loginService, statService) {
    statService.setShowGebruiker(false);
    var allActs = [];
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
		console.log("Proberen..");
		dbService.activiteiten.get(function (res) {
			console.log(res);
			if (res.success) {
				$scope.activiteiten = res.data;
				allActs = res.data;
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

	$scope.toonDatum = function(datum) {
		var d = new Date(datum),
		maanden = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
		maand = maanden[d.getMonth()];
		var checkMinutes = function (minutes) {
			var m = minutes;
			var minutes = minutes.toString();
			if (minutes.length === 1 && minutes === "0") {
				return minutes + "0";
			} else if (minutes.length === 1 && m > 0) {
				return "0" + minutes;
			} else {
				return minutes;
			}
		}
		var checkField = function (field) {
			if (field === "-") {
				return "";
			} else {
				return field;
			}
		}
		d = d.toLocaleDateString().toString()[0] + checkField(d.toLocaleDateString().toString()[1]) + " " + maand + " | " + (d.getHours() - 1) + ":" + checkMinutes(d.getMinutes());
		return d;
	}

	// Zoek activiteiten
	$scope.filters = [];
	$scope.selectedFilter = "All";
	var setFilters = function (filters) {
		$scope.filters = filters;
	}
	var getCategorieen = function () {
		dbService.hoofdCategorieen.get(function (res) {
			setFilters(res.data);
		});
	}
	getCategorieen();
	$scope.setClass = function (pointer) {
		if (pointer.naam === $scope.selectedFilter) {
			return pointer.icoonHover;
		} else {
			return pointer.icoon;
		}
	}
	$scope.changeFilter = function (pointer) {
		var i, filteredActs = [];
		$scope.activiteiten = allActs;
		$scope.selectedFilter = "All";
		if (pointer.toString() !== "All") {
			for (i = 0; i < $scope.activiteiten.length; i += 1) {
				if ($scope.activiteiten[i].hoofdCategorie.naam.toString() === pointer.toString()) {
					filteredActs.push($scope.activiteiten[i]);
				}
			}
			$scope.activiteiten = filteredActs;
			$scope.selectedFilter = pointer;
		}
	}
	/*
	$scope.filters = [
	{
		"icon" : "fa fa-calendar-o",
		"naam" : "Calendar",
		"filter" : "All",
		"class" : "selected"
	},
	{
		"icon" : "fa fa-futbol-o",
		"naam" : "Voetballen",
		"filter" : "Voetballen",
		"class" : "notSelected"
	},
	{
		"icon" : "fa fa-bicycle",
		"naam" : "Fietsen",
		"filter" : "Fietsen",
		"class" : "notSelected"
	},
	{
		"icon" : "fa fa-life-ring",
		"naam" : "Zwemmen",
		"filter" : "Zwemmen",
		"class" : "notSelected"
	},
	{
		"icon" : "fa fa-users",
		"naam" : "Vrienden",
		"filter" : "Vrienden",
		"class" : "notSelected"
	},
	{
		"icon" : "fa fa-rub",
		"naam" : "Vrienden",
		"filter" : "Vrienden",
		"class" : "notSelected"
	},
	{
		"icon" : "fa fa-university",
		"naam" : "Vrienden",
		"filter" : "Vrienden",
		"class" : "notSelected"
	}
	]
	*/
	//
};