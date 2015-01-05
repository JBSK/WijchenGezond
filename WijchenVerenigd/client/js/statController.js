var statController = function ($routeParams, $scope, $window, dbService, statService) {
	$scope.statistieken = {};

	var getTotaalStats = function() {
		$scope.statistieken = [
		{

			icon : "fa fa-users",
			pointer : "Nu actief",
			data : 5241
		},
		{
			icon : "fa fa-pie-chart",
			pointer : "Punten vandaag",
			data : 122
		},
		{
			icon : "fa fa-line-chart",
			pointer : "Populairste activiteit",
			data : "Voetbal"
		},
		{
			icon : "fa fa-trophy",
			pointer : "Punten totaal",
			data : "574/750"
		}];
	}

	var getGebruikerStats = function() {
		$scope.statistieken = [
		{
			icon : "fa fa-heart",
			pointer : "Favoriete activiteit",
			data : "Boogschieten"
		},
		{
			icon : "fa fa-plus",
			pointer : "Punten totaal",
			data : 122
		},
		{
			icon : "fa fa-clock-o",
			pointer : "Punten deze maand",
			data : 17
		},
		{
			icon : "fa fa-trophy",
			pointer : "Aantal activiteiten",
			data : 11
		}];
	}

	var BepaalStats = function () {
		if (statService.showGebruiker) {
			getGebruikerStats();
		} else {
			getTotaalStats();
		}
	}
	BepaalStats();

	$scope.$on('showGebruikerUpdated', function() {
		BepaalStats();
    });
}