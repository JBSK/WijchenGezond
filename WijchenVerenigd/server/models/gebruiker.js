var bcrypt   = require('bcrypt-nodejs');
var G = require('./../models/mongooseSchemas').G;
var A = require('./../models/mongooseSchemas').A;
var SC = require('./../models/mongooseSchemas').SC;

var response = function (message, success, data) {
    return {
        message : message,
        success : success,
        data : data
    }
}

exports.getGebruiker = function (id, callback) {
    'use strict';
    var pkg = {
        gebruiker : {},
        vrienden : [],
        aantalActiviteiten : 0,
        aantalPuntenMaand : 0,
        aantalPuntenTotaal : 0,
        populairsteActiviteit : "Voetballen",
        percentageProfiel : "25%"
    };
    var acts = [];
    var sendGebruiker = function () {
        callback(response("De gebruiker is gevonden", true, pkg));
    }
    var getPuntenTotaal = function () {
        sendGebruiker();
    }
    var getPuntenMaand = function () {
        getPuntenTotaal();
    }
    var getPopulairsteActiviteit = function () {
        getPuntenMaand();
    }
    var getAantalActiviteiten = function () {
        var i, x;
        for (i = 0; i < acts.length; i += 1) {
            for (x = 0; x < acts[i].deelnemers.length; x += 1) {
                if (acts[i].deelnemers[x] === pkg.gebruiker._id) {
                    pkg.aantalActiviteiten += 1;
                }
            }
        }
        getPopulairsteActiviteit();
    }
    var getActiviteiten = function () {
        var getActs = function() {
            A.find(function (error, data) {
                if (error) {
                    console.log(error);
                    callback(response("Er is iets misgegaan..", false, false));
                } else {
                    acts = data;
                    getAantalActiviteiten();
                }
            });
        }
        getActs();
    }
    var getVrienden = function () {
        var vulVriend = function (nummer) {
            G.findOne({_id : pkg.gebruiker.vrienden[nummer]}, function (error, data) {
                if (error) {
                    console.log(error);
                    callback(response("Er is iets misgegaan..", false, false));
                } else {
                    pkg.vrienden.push(data);
                    if (nummer === (pkg.gebruiker.vrienden.length - 1)) {
                        getActiviteiten();
                    }
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < pkg.gebruiker.vrienden.length; i += 1) {
                vulVriend(i);
            }
        }
        if (pkg.gebruiker.vrienden.length > 0) {
            loop();
        } else {
            getActiviteiten();
        }
    }
    var getGeb = function () {
        G.findOne({_id : id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan.", false, id));
            } else {
                if (data) {
                    pkg.gebruiker = data;
                    getVrienden();
                } else {
                    callback(response("De gezochte gebruiker kan niet worden gevonden.", false, false));
                }
            }
        });
    }
    getGeb();
}

exports.getGebruikers = function (callback) {
    'use strict';
    G.find(function (error, data) {
        if (error) {
            console.log(error);
            callback(response("Er is iets misgegaan.", false, false));
        } else {
            callback(response("De gebruikers zijn gevonden.", true, data));
        }
    });
};

exports.createGebruiker = function (gebruiker, callback) {
    var slaGebruikerOp = function (newGebruiker) {
        newGebruiker.save(function (error, madeGebruiker) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegeaan.", false,  false));
            } else {
                callback(response("De gebruiker is succesvol aangemaakt.", true, madeGebruiker));
            }
        });
    }

    var maakNieuweGebruiker = function () {
        newGebruiker = new G();
        newGebruiker.username = gebruiker.username;
        newGebruiker.email = gebruiker.email;
        newGebruiker.wachtwoord = bcrypt.hashSync(gebruiker.wachtwoord, bcrypt.genSaltSync(8), null);
        slaGebruikerOp(newGebruiker);
    }

    var checkWachtwoord = function () {
        if (gebruiker.wachtwoord === gebruiker.bevestigWachtwoord && gebruiker.wachtwoord.length > 6) {
            maakNieuweGebruiker();
        } else {
            callback(response("Het gegeven wachtwoord komt niet overeen met het bevestigde wachtwoord of is niet lang genoeg.", false, gebruiker));
        }
    };

    var checkUsername = function () {
        var valideerUsername = function () {
            if (gebruiker.username.length > 3 && gebruiker.username.indexOf(' ') < 1) {
                checkWachtwoord();
            } else {
                callback(response("De gegeven username is niet lang genoeg. Probeer een andere.", false, gebruiker));
            }
        };

        var checkOfUsernameBestaat = function () {
            G.find({username : gebruiker.username}, function (error, data) {
                if (error) {
                    console.log(error);
                    callback(response("Er is iets misgegeaan. Probeer het later nog eens.", false, gebruiker));
                } else {
                    if (data[0]) {
                        callback(response("De gegeven username bestaat al. Probeer een andere.", false, gebruiker));
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
                callback(response("Het opgegeven email-adres is niet valide.", false, gebruiker));
            }
        }
        var checkOfEmailBestaat = function (email) {
            G.find({email : email}, function(error, data) {
                if (error) {
                    console.log(error);
                    callback(response("Er is iets misgegeaan, probeer het later nog eens.", false, gebruiker));
                } else {
                    if (data[0]) {
                        callback(response("Het opgegeven email-adres bestaat al.", false, gebruiker));
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
            callback(response("Niet alle verplichte velden zijn ingevuld.", false, gebruiker));
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
                callback(response("Er is iets misgegaan", false, gegevens));
            } else {
                callback(response("De persoon is toegevoegd aan je vriendenlijst.", true, gegevens));
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
                    callback(response("Je bent al vrienden met deze persoon.", true, gegevens));
                    return;
                }
            }
            voegVriendToe();
        }
    }
    var zoekVriend = function () {
        G.find({_id : gegevens.vriendId}, function (error, data) {
            if (error) {
                console.log(error);
                    callback(response("De gegeven vriend bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    checkOfAlVrienden();
                } else {
                    callback(response("De gegeven vriend bestaat niet.", false, gegevens));
                }
            }
        });

    };

    var zoekGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                    callback(response("De gegeven gebruiker bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    gebruiker = data[0];
                    zoekVriend();
                } else {
                    callback(response("De gegeven gebruiker bestaat niet.", false, gegevens));
                }
            }
        });
    }

    var valideerVelden = function () {
        if (gegevens._id && gegevens.vriendId) {
            zoekGebruiker();
        } else {
            callback(response("Niet alle verplichte velden zijn ingevuld", false, gegevens));
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
                G.find({_id : gebruiker.vrienden[i]}, function(error, data) {
                    if (error) {
                        console.log(error);
                        callback(response("Er is iets misgegaan", false, false));
                        return;
                    } else {
                        if (data[0]) {
                            vrienden.push(data[0]);
                            if (vrienden.length === aantalVrienden) {
                                callback(response("Het zoeken naar de vrienden is gelukt.", true, vrienden));
                            }
                        } else {
                            callback(response("Één van de vrienden bestaat niet.", false, false));
                            return;
                        }
                    }
                });
            }
        } else {
            callback(response("Het zoeken naar de vrienden is gelukt.", true, vrienden));
        }
    };
    var zoekGebruiker = function () {
        G.find({_id : gebruikerId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", false, false));
            } else {
                if (data[0]) {
                    gebruiker = data[0];
                    verzamelVrienden();
                } else {
                    callback(response("De gegeven gebruiker bestaat niet.", false, false));
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
                callback(response("Er is iets misgegaan.", false, gegevens));
            } else {
                callback(response("De vriend is succesvol verwijderd.", true, savedGebruiker));
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
        callback(response("Je bent geen vrienden met deze persoon.", false, gegevens));
    };
    var checkOfVriendBestaat = function () {
        G.find({_id : gegevens.vriendId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("De gegeven vriend bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    checkOfVrienden();
                } else {
                    callback(response("De gegeven vriend bestaat niet.", false, gegevens));
                }
            }
        });
    };
    var zoekGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("De gegeven gebruiker bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    gebruiker = data[0];
                    checkOfVriendBestaat();
                } else {
                    callback(response("De gegeven gebruiker bestaat niet.", false, gegevens));
                }
            }
        });
    };
    var valideerVelden = function () {
        if (gegevens._id && gegevens.vriendId) {
            zoekGebruiker();
        } else {
            callback(response("Niet alle verplichte velden zijn ingevuld", false, gegevens));
        }
    };
    valideerVelden();
};

exports.login = function (gebruiker, callback) {
    var inlogGebruiker;
    var checkWachtwoord = function () {
        console.log(bcrypt.compareSync(gebruiker.wachtwoord, inlogGebruiker.wachtwoord));
        if (bcrypt.compareSync(gebruiker.wachtwoord, inlogGebruiker.wachtwoord)) {
            callback(response("Alles klopt.", true, {succes : true, _id : inlogGebruiker._id, username : inlogGebruiker.username, avatar : inlogGebruiker.avatar}));
        } else {
            callback(response("Het gegeven wachtwoord klopt niet.", false, {succes : false, _id : false}));
        }
    }
    var zoekGebruikerEmail = function () {
        G.find({email : gebruiker.emailUsername}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", false, {succes : false, _id : false}));
            } else {
                if (data[0]) {
                    inlogGebruiker = data[0];
                    checkWachtwoord();
                } else {
                    callback(response("Het opgegeven username of email-adres bestaat niet.", false, {succes : false, _id : false}));
                }
            }
        });
    }
    var zoekGebruikerUsername = function () {
        G.find({username : gebruiker.emailUsername}, function (error, data) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", false, {succes : false, _id : false}));
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
            callback(response("Niet alle verplichte velden zijn ingevuld", false, {succes : false, _id : false}));
        }
    }
    valideerVelden();
}

exports.zoekVrienden = function (id, callback) {
    var gebs;
    var zoekWieVolgt = function () {
        var i, x, volgers = [];
        for (i = 0; i < gebs.length; i += 1) {
            if (gebs[i].vrienden.length > 0) {
                for (x = 0; x < gebs[i].vrienden.length; x += 1) {
                    if (gebs[i].vrienden[x].toString() === id.toString()) {
                        volgers.push(gebs[i]);
                    }
                }
            }
        }
        callback(response("De volgers zijn gevonden..", true, volgers));
    }
    var zoekGebruikers = function () {
        G.find(function (error, gebruikers) {
            if (error) {
                console.log(error);
                callback(response("Er is iets misgegaan", false, false));
            } else {
                gebs = gebruikers;
                zoekWieVolgt();
            }
        })
    }
    zoekGebruikers();
}

