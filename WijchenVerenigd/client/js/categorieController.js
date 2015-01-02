var categorieController = function ($routeParams, $scope, $window, dbService) {
	$scope.hoofdCategorieen;
	$scope.message;
	dbService.hoofdCategorieen.get({}, function(res) {
		$scope.message = res.message;
		$scope.hoofdCategorieen = res.data;
	});

	$scope.verwijderHoofdCategorie = function(_id) {
		dbService.hoofdCategorieen.delete({_id : _id}, function(res) {
			$scope.message = res.message;
			dbService.hoofdCategorieen.get({}, function(res) {
				$scope.message = res.message;
				$scope.hoofdCategorieen = res.data;
			});
		});
	}
}