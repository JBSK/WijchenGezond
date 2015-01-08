var activiteitController = function ($routeParams, $scope, $window, dbService) {
	$scope.activiteit = {};
	$scope.activiteit.punten = 0;
	$scope.activiteit.dagen = false;
	$scope.activiteit.datum = false;
	$scope.hoofdCategorieen;
	$scope.subCategorieen;
	dbService.hoofdCategorieen.get({}, function(res) {
		$scope.message = res.message;
		$scope.hoofdCategorieen = res.data;
	});
	$scope.updateSubs = function() {
		dbService.subHoofdCategorieen.get({_id : $scope.activiteit.hoofdCategorie._id}, function(res) {
			$scope.message = res.message;
			$scope.subCategorieen = res.data;
		});
	};
	$scope.updatePunten = function() {
		$scope.activiteit.punten = $scope.activiteit.subCategorie.punten;
	};
	$scope.toonTijdDatum = function() {
		if ($scope.activiteit.doorloopTijd === "eenmalig") {
			$scope.activiteit.dagen = false;
			$scope.activiteit.datum = [{dag : "1", maand : "Januari", jaar : "2015"}];
		} else {
			$scope.activiteit.dagen = [{naam : "maandag", startTijd : "--:--", eindTijd : "--:--"}];
			$scope.activiteit.datum = false;
		}
	};
	$scope.voegDagToe = function() {
		if ($scope.activiteit.dagen.length < 7) {
			$scope.activiteit.dagen[$scope.activiteit.dagen.length] = {naam : "maandag", startTijd : "--:--", eindTijd : "--:--"};
		}
	};
	$scope.verwijderDag = function() {
		console.log("Verwijderen");
		if ($scope.activiteit.dagen.length > 1) {
			$scope.activiteit.dagen.pop();
		}
	};

	$scope.saveActiviteit = function() {
		console.log($scope.activiteit);
	}
}