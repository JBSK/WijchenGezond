var profielController = function ($routeParams, $scope, $window, dbService, loginService) {
    var inlogId = "0";
    $scope.gebruiker = {};
    $scope.toonVriendenKnop = false;
    $scope.feeds = {};
    $scope.vriendenKnopValue = "Volgen";
    var toonVriendenKnop = function (value) {
        $scope.toonVriendenKnop = value;
    }
    var setVriendenKnopValue = function (value) {
        $scope.vriendenKnopValue = value;
    }
    var checkOfvrienden = function (vrienden) {
        var i;
        for (i = 0; i < vrienden.length; i += 1) {
            console.log(vrienden);
            if ($routeParams._id === vrienden[i]._id) {
                setVriendenKnopValue("Ontvolgen");
                return;
            }
        }
        setVriendenKnopValue("Volgen");
    }
    var getVolgend = function () {
        dbService.volgend.get({_id : $routeParams._id}, function (res) {
            console.log(res);
            if (res.success) {
                $scope.vrienden = res.data;
            }
        });
    }
    var getVolgers = function () {
        dbService.volgers.get({_id : inlogId}, function (res) {
            if (res.success) {
                checkOfvrienden(res.data);
            }
        });
    }
    var checkLogin = function () {
        dbService.login.get(function (res) {
            if (res.success) {
                inlogId = res.data._id;
                getVolgers();
                getVolgend();
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
            } else {
                console.log("De gebruiker kan niet gevonden worden..");
            }
        });
    }
    getGebruiker($routeParams._id);

    $scope.$on('loggedInUpdated', function() {
        getGebruiker($routeParams._id);
    });

    $scope.vriendenWordenOpzeggen = function (val) {
        var pkg = {
            vriendId : $routeParams._id,
            _id : inlogId
        }
        if (val === "Volgen") {
            dbService.volg.post(pkg, function (res) {
                getGebruiker($routeParams._id);
            });
        } else if (val === "Ontvolgen") {
            dbService.ontVolg.post(pkg, function (res) {
                getGebruiker($routeParams._id);
            });
        }
    }
};