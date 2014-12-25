var meterController = function ($scope, dbService) {
	var meterAchtergrond = document.getElementById("meterAchtergrond");
	var meterPunten = document.getElementById("meterPunten");
	$scope.meterPunten;
	$scope.meterDoel;

	var setMeter = function (meter) {
		var hoogteMeterPunten = (402 / meter.puntenDoel) * meter.puntenTussenstand;
		var margeMeterPunten = (404 - 1) - hoogteMeterPunten;
		meterPunten.style.height = hoogteMeterPunten + "px";
		meterPunten.style.marginTop = margeMeterPunten + "px";
	}

	dbService.meter.get(function (res) {
		$scope.meterPunten = res.data.puntenTussenstand + " / " + res.data.puntenDoel;
		$scope.meterDoel = res.data.doel;
		setMeter(res.data);
	});
}