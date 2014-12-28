var feedsController = function ($routeParams, $scope, $window, dbService) {
	$scope.feeds = [];
	$scope.predicate = 'datum';
	$scope.gebruikerLogin = {};
	$scope.gebruikerLogin.avatar = "img/avatar.png";

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

	var getFeeds = function () {
		dbService.feeds.get({soort : "feeds"}, function (res) {
			console.log(res);
			$scope.feeds = res.data;
		});
	}
	getFeeds();

	$scope.postFeed = function (id, reactie) {
		var makeAndSend = function () {
			console.log(id);
			var newReactie = {};
			if (!($scope.gebruikerLogin._id)) {
				console.log("Je bent niet ingelogd");
			} else {
				newReactie.gebruikerId = $scope.gebruikerLogin._id;
				newReactie.reactie = reactie;
				newReactie.feedId = id;
				console.log("We gaan sturen!");
				dbService.react.post(newReactie, function (res) {
					console.log(res);
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
					console.log($scope.gebruikerLogin);
					makeAndSend();
				} else {
					console.log("Je bent niet ingelogd.");
				}
			});
		}
		checkLogin();
	}
}