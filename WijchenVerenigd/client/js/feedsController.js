var feedsController = function ($routeParams, $scope, $window, dbService, loginService, statService) {
    statService.setShowGebruiker(false);
	$scope.feeds = [];
	$scope.predicate = 'datum';
	$scope.gebruikerLogin = {};
	$scope.gebruikerLogin.avatar = "img/avatar.png";
	$scope.vrienden = {};

	var getFeeds = function () {
		dbService.feedsGebruikerVrienden.get({_id : $scope.gebruikerLogin._id}, function (res) {
			console.log(res);
			$scope.feeds = res.data;
		});
	}

	var getVolgend = function () {
		console.log("getGeruiker");
		dbService.volgend.get({_id : $scope.gebruikerLogin._id}, function (res) {
			console.log(res);
			if (res.success) {
				$scope.vrienden = res.data;
			}
		});
	}

	var checkLogin = function () {
		dbService.login.get(function(res) {
			if (res.success) {
				$scope.gebruikerLogin = res.data;
				getVolgend();
				getFeeds();
			} else {
				console.log("Je bent niet ingelogd.");
			}
		});
	};
	checkLogin();

	$scope.postFeed = function (id, reactie) {
		var makeAndSend = function () {
			var newReactie = {};
			if (!($scope.gebruikerLogin._id)) {
				console.log("Je bent niet ingelogd");
			} else {
				newReactie.gebruikerId = $scope.gebruikerLogin._id;
				newReactie.reactie = reactie;
				newReactie.feedId = id;
				dbService.react.post(newReactie, function (res) {
					if (res.success) {
						getFeeds();
					} else {

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
					console.log("Je bent niet ingelogd.");
				}
			});
		}
		checkLogin();
	}

	$scope.maakNieuws = function (feed) {
		var checkLength = function(le) {
			if (le === 1) {
				return "ander";
			} else {
				return "anderen";
			}
		}
		if (feed.feed.nieuws.toString() === "Heeft de volgende activiteit gedaan:") {
			return feed.feed.nieuws + " " + feed.activiteit.naam + ". Samen met " + feed.activiteit.deelnemers.length + " " + checkLength(feed.activiteit.deelnemers.length) + ", voor " + feed.activiteit.puntenPerDeelnemer + " punten per deelnemer.";
		} else {
			return feed.feed.nieuws + " " + feed.activiteit.naam;
		}
	}

	$scope.toonDatum = function (datum) {
		var d = new Date(datum);
		return d.toDateString();
	}
}