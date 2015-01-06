var gebruikerController = function ($routeParams, $scope, $window, $location, dbService, loginService) {
    loginService.showLogin = false;
	$scope.message = "DOE MEE!";
    $scope.registreer = function (reg) {
        console.log(reg);
        dbService.createGebruiker.post(reg ,function (res) {
            console.log(res);
            if (res.success) {
                $location.path("/");
            } else {
                $scope.message = res.message;
            }
        });
    }
};