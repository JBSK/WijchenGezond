var statController = function ($routeParams, $scope, $window, dbService) {
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

	getTotaalStats();

	$scope.meterPunten;
	$scope.meterDoel;

	dbService.meter.get(function (res) {
		$scope.meterPunten = res.data.puntenTussenstand + " / " + res.data.puntenDoel;
		$scope.meterDoel = res.data.doel;
	});

	$scope.$on('locatieProfiel', function(event, args) {
		getGebruikerStats();
	});
	$scope.$on('locatieNietProfiel', function(event, args) {
		getTotaalStats();
	});
}