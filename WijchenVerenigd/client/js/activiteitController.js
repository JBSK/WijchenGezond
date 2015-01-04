var activiteitController = function ($routeParams, $scope, $window, dbService, $location, statService) {
    statService.setShowGebruiker(false);
	var creatorId;
	dbService.login.get(function(res) {
		if (res.success) {
			creatorId = res.data._id;
		} else {
			console.log("Je bent niet ingelogd.");
		}
	});
	
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
			$scope.activiteit.dagen = [{nummer : "1", beginTijd : "--:--", eindTijd : "--:--"}];
			$scope.activiteit.datum = false;
		}
	};
	$scope.voegDagToe = function() {
		if ($scope.activiteit.dagen.length < 7) {
			$scope.activiteit.dagen[$scope.activiteit.dagen.length] = {nummer : "1", beginTijd : "--:--", eindTijd : "--:--"};
		}
	};
	$scope.verwijderDag = function() {
		if ($scope.activiteit.dagen.length > 1) {
			$scope.activiteit.dagen.pop();
		}
	};

	$scope.saveActiviteit = function() {
		var berekenData = function (dag) {
			var dagNummer = parseInt(dag.nummer);
			var beginTijdUren = dag.beginTijdUren;
			var eindTijdUren = dag.eindTijdUren;
			var beginTijdMin = dag.beginTijdMin;
			var eindTijdMin = dag.eindTijdMin;
			var vandaag = new Date();
			var huidigDagNummer = parseInt(vandaag.getDay());
			var ratio;
			if (huidigDagNummer > dagNummer) {
				ratio = (7 - huidigDagNummer) + dagNummer;
			} else if (huidigDagNummer < dagNummer) {
				ratio = dagNummer - huidigDagNummer;
			} else {
				if (beginTijdUren > vandaag.getHours() || (beginTijdUren === vandaag.getHours() && beginTijdMin > vandaag.getMinutes())) {
					ratio = 0;
				}
				else {
					ratio = 7;
				}
			}
			var beginDatum = new Date(vandaag.getTime() + ratio * 24 * 60 * 60 * 1000);
			beginDatum.setHours(beginTijdUren, beginTijdMin);
			beginDatum.setHours(beginTijdUren, beginTijdMin);
			var eindDatum = new Date(beginDatum);
			eindDatum.setHours(eindTijdUren, eindTijdMin);
			return {
				beginTijd : beginDatum.toString(),
				eindTijd : eindDatum.toString()
			}
		}
		var a = $scope.activiteit;
		var nA = {};
		nA.creatorId = creatorId;
		nA.naam = a.naam;
		nA.subCategorieId = a.subCategorie._id;
		nA.intensiteit = a.intensiteit;
		nA.doorloopTijd = a.doorloopTijd;
		nA.omschrijving = a.omschrijving;
		nA.puntenPerDeelnemer = a.punten;
		nA.deelnemers = [creatorId];
		nA.verzamelPlaats = a.verzamelPlaats;
		nA.minPers = a.minPers;
		nA.maxPers = a.maxPers;
		nA.groep = true;
		if (a.doorloopTijd === "eenmalig") {
			nA.eenmalig = {
				beginTijd : (new Date(a.datum.jaar, a.datum.maand, a.datum.dag, (a.datum.beginTijd[0] + a.datum.beginTijd[1]), (a.datum.beginTijd[3] + a.datum.beginTijd[4]))).toString(),
				eindTijd : (new Date(a.datum.jaar, a.datum.maand, a.datum.dag, (a.datum.eindTijd[0] + a.datum.eindTijd[1]), (a.datum.eindTijd[3] + a.datum.eindTijd[4]))).toString()
			};
		} else if (a.doorloopTijd === "wekelijks") {
			var dagen = [];
			var i;
			for (i = 0; i < a.dagen.length; i += 1) {
				a.dagen[i].beginTijdUren = parseInt(a.dagen[i].beginTijd[0] + a.dagen[i].beginTijd[1]);
				a.dagen[i].beginTijdMin = parseInt(a.dagen[i].beginTijd[3] + a.dagen[i].beginTijd[4]);
				a.dagen[i].eindTijdUren = parseInt(a.dagen[i].eindTijd[0] + a.dagen[i].eindTijd[1]);
				a.dagen[i].eindTijdMin = parseInt(a.dagen[i].eindTijd[3] + a.dagen[i].eindTijd[4]);
				dagen[i] = berekenData(a.dagen[i]);
			}
			nA.dagen = dagen;
		}
		dbService.activiteiten.post(nA, function (res) {
			if (res.success) {
				$location.path("/feed");
			} else {
				console.log(res);
			}
		});
	}
}