var meterController = function ($scope, dbService, actService) {
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

	var getMeter = function () {
		dbService.meter.get(function (res) {
			$scope.meterPunten = res.data.puntenTussenstand + " / " + res.data.puntenDoel;
			$scope.meterDoel = res.data.doel;
	        console.log(res.data);
			setMeter(res.data);
		});
	}
	getMeter();

	setInterval(function () {
		dbService.reken.get(function(res) {
			console.log("Update");
			getMeter();
			actService.signal();
		});
	}, 5000);
}