var profielController = function ($routeParams, $scope, $window, dbService, loginService) {
    var inlogId = "0";
    $scope.gebruiker = {};
    $scope.toonVriendenKnop = false;
    $scope.feeds = {};
    var toonVriendenKnop = function (value) {
        $scope.toonVriendenKnop = value;
    }
    var checkLogin = function () {
        dbService.login.get(function (res) {
            if (res.success) {
                inlogId = res.data._id;
                if (inlogId === $scope.gebruiker.gebruiker._id) {
                    toonVriendenKnop(false);
                } else {
                    toonVriendenKnop(true);
                }
            } else {
                toonVriendenKnop(false);
            }
        });
    }
    var getGebruiker = function (id) {
        dbService.gebruiker.get({_id : id}, function (res) {
            if (res.success) {
                $scope.gebruiker = res.data;
                checkLogin();
                console.log($scope.gebruiker);
            } else {
                console.log("De gebruiker kan niet gevonden worden..");
            }
        });
    }
    getGebruiker($routeParams._id);

    $scope.$on('loggedInUpdated', function() {
        console.log("Nog eens zoeken..");
        getGebruiker($routeParams._id);
    });
};