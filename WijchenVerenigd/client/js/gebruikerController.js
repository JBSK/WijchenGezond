var gebruikerController = function ($routeParams, $scope, $window, dbService) {
	$scope.ingelogd = false;
	$scope.inlogMessage = "";
	$scope.checkLogin = function () {

	};

	$scope.logout = function () {
		dbService.logout(function(res) {
			inlogMessage = res.message;
		});
	};

    $scope.reg = function() {
        console.log($scope.createGebruiker);
        if($scope.createGebruiker.wachtwoord != $scope.createGebruiker.bevestigWachtwoord)
        {
            $scope.IsMatch=true;
            return false;
        }
        $scope.IsMatch=false;

        dbService.createGebruiker.post($scope.createGebruiker ,function (res) {
            $scope.regMsg = true;
            $scope.regMessage = res.message;
        });
	};
};