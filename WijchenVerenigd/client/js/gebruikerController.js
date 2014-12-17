var gebruikerController = function ($routeParams, $scope, $window, dbService) {
    $scope.ingelogd = false;
    $scope.inlogMessage = "";
    $scope.checkLogin = function () {

    };
    $scope.log = function () {

        dbService.login.post($scope.login, function (data) {
            console.log(data.message);

        });
    };
    $scope.logout = function () {
        dbService.logout(function (res) {
            inlogMessage = res.message;
        });
    };

    $scope.reg = function () {

        if ($scope.createGebruiker.wachtwoord != $scope.createGebruiker.bevestigWachtwoord) {
            $scope.IsMatch = true;
            return false;
        }
        $scope.IsMatch = false;

        dbService.createGebruiker.post($scope.createGebruiker, function (data) {
            console.log(data.message);
            console.log(data);
        })
    };
};