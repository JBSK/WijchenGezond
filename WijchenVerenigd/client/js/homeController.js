var homeController = function ($routeParams, $scope, $window, dbService) {

	$scope.activiteiten;
	$scope.predicate = 'datum';

	dbService.activiteiten.get(function (res) {
		$scope.activiteiten = res.data;
	});
};