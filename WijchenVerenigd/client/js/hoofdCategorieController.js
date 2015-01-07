var hoofdCategorieController = function ($routeParams, $scope, $window, dbService) {
	$scope.message = "Voeg een categorie toe.";
	$scope.hoofdCategorie;
	$scope.subCategorieen;
	if ($routeParams._id) {
		dbService.hoofdCategorieen.get({_id : $routeParams._id}, function(res) {
			$scope.message = res.message;
			$scope.hoofdCategorie = res.data;
		});

		dbService.subHoofdCategorieen.get({_id : $routeParams._id}, function(res) {
			$scope.subCategorieen = res.data;
		});
	}

	$scope.addHoofdCategorie = function(hoofdCategorie) {
		dbService.hoofdCategorieen.post(hoofdCategorie, function(res) {
			$scope.message = res.message;
			if (!$routeParams._id) {
				$routeParams._id = res.data._id;
			}
		});
	};

	$scope.addSubCategorie = function(subCategorie) {
		if ($routeParams._id) {
			subCategorie.hoofdCategorieId = $routeParams._id
			dbService.subCategorieen.post(subCategorie, function(res) {
				$scope.message = res.message;
				dbService.subHoofdCategorieen.get({_id : $routeParams._id}, function(res) {
					$scope.subCategorieen = res.data;
				});
			});
		} else {
			$scope.message = "Maak eerst een hoofdcategorie aan.";
		}
	};

	$scope.verwijderSubCategorie = function(_id) {
		dbService.subCategorieen.delete({_id : _id}, function(res) {
			$scope.message = res.message;
			dbService.subHoofdCategorieen.get({_id : $routeParams._id}, function(res) {
				$scope.subCategorieen = res.data;
			});
		});
	}
}