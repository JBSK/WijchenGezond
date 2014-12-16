var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var GebruikerSchema = mongoose.Schema({
    voornaam : {type : String, required : false},
    achternaam : {type : String, required : false},
    username : {type : String, required : true},
    email : {type : String, required : true},
    wachtwoord : {type : String, required : true},
    geboorteDatum : {type : Date, required : false},
    profielfoto : {type : String, required : false},
    beperking : {type : String, required : false},
    sportvereniging : {type : String, required : false},
    sporten : {type : [], required : false},
    aantalPunten : {type : Number, required : false},
    vrienden : {type : [], required : false}
}, {collection : "gebruikers"});

var Gebruiker = mongoose.model('Gebruiker', GebruikerSchema);
var exports = module.exports = {};

var response = function (message, data) {
    return {
        message : message,
        data : data
    }
}

exports.getGebruiker = function (_id, callback) {
    'use strict';
    Gebruiker.find({_id : _id}, function (err, gebruiker) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de gebruiker is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de gebruiker is gelukt.", gebruiker[0]));
        }
    });
}

exports.getGebruikers = function (callback) {
    'use strict';
    Gebruiker.find(function (err, gebruikers) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de gebruikers is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de gebruikers is gelukt.", gebruikers));
        }
    });
};

exports.createGebruiker = function (gebruiker, callback) {
    var slaGebruikerOp = function (newGebruiker) {
        newGebruiker.save(function (error, madeGebruiker) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegeaan.", {}));
            } else {
                callback(response("De gebruiker is succesvol aangemaakt.", madeGebruiker));
            }
        });
    }

    var maakNieuweGebruiker = function () {
        newGebruiker = new Gebruiker;
        newGebruiker.username = gebruiker.username;
        newGebruiker.email = gebruiker.email;
        newGebruiker.wachtwoord = bcrypt.hashSync(gebruiker.wachtwoord, bcrypt.genSaltSync(8), null);
        slaGebruikerOp(newGebruiker);
    }

    var checkWachtwoord = function () {
        if (gebruiker.wachtwoord === gebruiker.bevestigWachtwoord && gebruiker.wachtwoord.length > 6) {
            maakNieuweGebruiker();
        } else {
            callback(response("Het gegeven wachtwoord komt niet overeen met het bevestigde wachtwoord of is niet lang genoeg.", gebruiker));
        }
    };

    var checkUsername = function () {
        var valideerUsername = function () {
            if (gebruiker.username.length > 3 && gebruiker.username.indexOf(' ') < 1) {
                checkWachtwoord();
            } else {
                callback(response("De gegeven username is niet lang genoeg. Probeer een andere.", gebruiker));
            }
        };

        var checkOfUsernameBestaat = function () {
            Gebruiker.find({username : gebruiker.username}, function (error, data) {
                if (error) {
                    console.log(error);
                    callback(response("Er is iets misgegeaan. Probeer het later nog eens.", gebruiker));
                } else {
                    if (data[0]) {
                        callback(response("De gegeven username bestaat al. Probeer een andere.", gebruiker));
                    } else {
                        valideerUsername();
                    }
                }
            });
        };
        checkOfUsernameBestaat();
    }

    var checkEmail = function () {
        var valideerEmail = function (email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(email)) {
                checkUsername();
            } else {
                callback(response("Het opgegeven email-adres is niet valide.", gebruiker));
            }
        }
        var checkOfEmailBestaat = function (email) {
            Gebruiker.find({email : email}, function(error, data) {
                if (error) {
                    console.log(error);
                    callback(response("Er is iets misgegeaan, probeer het later nog eens.", gebruiker));
                } else {
                    if (data[0]) {
                        callback(response("Het opgegeven email-adres bestaat al.", gebruiker));
                    } else {
                        valideerEmail(gebruiker.email);
                    }
                }
            });
        }
        checkOfEmailBestaat(gebruiker.email);
    }

    var valideerVelden = function () {
        if (gebruiker.username && gebruiker.wachtwoord && gebruiker.bevestigWachtwoord && gebruiker.email) {
            checkEmail();
        } else {
            callback(response("Niet alle verplichte velden zijn ingevuld.", gebruiker));
        }
    }
    valideerVelden();
};

exports.addVriend = function (gegevens, callback) {
    var gebruiker;
    var slaGebruikerOp = function () {
        gebruiker.save(function(error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", gegevens));
            } else {
                callback(response("De persoon is toegevoegd aan je vriendenlijst.", gegevens));
            }
        });
    }
    var voegVriendToe = function () {
        gebruiker.vrienden.push(gegevens.vriendId);
        slaGebruikerOp();
    }
    var checkOfAlVrienden = function () {
        console.log(gebruiker);
        var i;
        if (gebruiker.vrienden.length < 1) {
            voegVriendToe();
        } else {
            for (i = 0; i < gebruiker.vrienden.length; i += 1) {
                console.log("x");
                if (gebruiker.vrienden[i] === gegevens.vriendId) {
                    callback(response("Je bent al vrienden met deze persoon.", gegevens));
                    return;
                }
            }
            voegVriendToe();
        }
    }
    var zoekVriend = function () {
        Gebruiker.find({_id : gegevens.vriendId}, function (error, data) {
            if (error) {
                console.log(error);
                    callback(response("De gegeven vriend bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    checkOfAlVrienden();
                } else {
                    callback(response("De gegeven vriend bestaat niet.", gegevens));
                }
            }
        });

    }

    var zoekGebruiker = function () {
        Gebruiker.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                    callback(response("De gegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    gebruiker = data[0];
                    zoekVriend();
                } else {
                    callback(response("De gegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    }

    var valideerVelden = function () {
        if (gegevens._id && gegevens.vriendId) {
            zoekGebruiker();
        } else {
            callback(response("Niet alle verplichte velden zijn ingevuld", gegevens));
        }
    }
    valideerVelden(gegevens);
};

exports.getVrienden = function (gebruikerId, callback) {
    var gebruiker;
    var vrienden = [];
    var verzamelVrienden = function () {
        var aantalVrienden = gebruiker.vrienden.length;
        var i;
        if (gebruiker.vrienden.length > 0) {
            for (i = 0; i < gebruiker.vrienden.length; i += 1) {
                Gebruiker.find({_id : gebruiker.vrienden[i]}, function(error, data) {
                    if (error) {
                        console.log(error);
                        callback(response("Er is iets misgegaan", {}));
                        return;
                    } else {
                        if (data[0]) {
                            vrienden.push(data[0]);
                            if (vrienden.length === aantalVrienden) {
                                callback(response("Het zoeken naar de vrienden is gelukt.", vrienden));
                            }
                        } else {
                            callback(response("Één van de vrienden bestaat niet.", {}));
                            return;
                        }
                    }
                });
            }
        } else {
            callback(response("Het zoeken naar de vrienden is gelukt.", vrienden));
        }
    };
    var zoekGebruiker = function () {
        Gebruiker.find({_id : gebruikerId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", {}));
            } else {
                if (data[0]) {
                    gebruiker = data[0];
                    verzamelVrienden();
                } else {
                    callback(response("De gegeven gebruiker bestaat niet.", {}));
                }
            }
        });
    };
    zoekGebruiker();
};

exports.delVriend = function (gegevens, callback) {
    var gebruiker;
    var slaGebruikerOp = function () {
        gebruiker.save(function(error, savedGebruiker) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan.", gegevens));
            } else {
                callback(response("De vriend is succesvol verwijderd.", savedGebruiker));
            }
        });
    };
    var verwijderVriend = function () {
        var i;
        for (i = 0; i < gebruiker.vrienden.length; i += 1) {
            if (gebruiker.vrienden[i] === gegevens.vriendId) {
                gebruiker.vrienden.splice(i,1);
            }
        }
        slaGebruikerOp();
    };
    var checkOfVrienden = function () {
        var i;
        if (gebruiker.vrienden.length > 0) {
            for (i = 0; i < gebruiker.vrienden.length; i += 1) {
                if (gebruiker.vrienden[i] === gegevens.vriendId) {
                    verwijderVriend();
                    return;
                }
            }
        }
        callback(response("Je bent geen vrienden met deze persoon.", gegevens));
    };
    var checkOfVriendBestaat = function () {
        Gebruiker.find({_id : gegevens.vriendId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("De gegeven vriend bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    checkOfVrienden();
                } else {
                    callback(response("De gegeven vriend bestaat niet.", gegevens));
                }
            }
        });
    };
    var zoekGebruiker = function () {
        Gebruiker.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("De gegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    gebruiker = data[0];
                    checkOfVriendBestaat();
                } else {
                    callback(response("De gegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    };
    var valideerVelden = function () {
        if (gegevens._id && gegevens.vriendId) {
            zoekGebruiker();
        } else {
            callback(response("Niet alle verplichte velden zijn ingevuld", gegevens));
        }
    };
    valideerVelden();
};

exports.login = function (gebruiker, callback) {
    var inlogGebruiker;
    var checkWachtwoord = function () {
        console.log(bcrypt.compareSync(gebruiker.wachtwoord, inlogGebruiker.wachtwoord));
        if (bcrypt.compareSync(gebruiker.wachtwoord, inlogGebruiker.wachtwoord)) {
            callback(response("Alles klopt.", {succes : true, _id : inlogGebruiker._id}));
        } else {
            callback(response("Het gegeven wachtwoord klopt niet.", {succes : false, _id : false}));
        }
    }
    var zoekGebruikerEmail = function () {
        Gebruiker.find({email : gebruiker.emailUsername}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", {succes : false, _id : false}));
            } else {
                if (data[0]) {
                    inlogGebruiker = data[0];
                    checkWachtwoord();
                } else {
                    callback(response("Het opgegeven username of email-adres bestaat niet.", {succes : false, _id : false}));
                }
            }
        });
    }
    var zoekGebruikerUsername = function () {
        Gebruiker.find({username : gebruiker.emailUsername}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", {succes : false, _id : false}));
            } else {
                if (data[0]) {
                    inlogGebruiker = data[0];
                    checkWachtwoord();
                } else {
                    zoekGebruikerEmail();
                }
            }
        });
    }
    var valideerVelden = function () {
        if (gebruiker.emailUsername && gebruiker.wachtwoord) {
            zoekGebruikerUsername();
        } else {
            callback(response("Niet alle verplichte velden zijn ingevuld", {succes : false, _id : false}));
        }
    }
    valideerVelden();
}

