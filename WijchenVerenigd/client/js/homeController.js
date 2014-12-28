var homeController = function ($routeParams, $scope, $window, dbService) {

	$scope.activiteiten;
	$scope.predicate = 'datum';

	dbService.activiteiten.get(function (res) {
		console.log(res);
		$scope.activiteiten = res.data;
	});
};