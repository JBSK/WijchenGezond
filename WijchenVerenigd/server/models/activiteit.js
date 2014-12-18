var cb;
var exports = module.exports = {};
var A = require('./../models/mongooseSchemas').A;
var G = require('./../models/mongooseSchemas').G;
var HC = require('./../models/mongooseSchemas').HC;
var SC = require('./../models/mongooseSchemas').SC;

var resp = function (message, data) {
    return {
        message : message,
        data : data
    }
}

exports.createActiviteit = function (gegevens, callback) {
    var slaActiviteitOp = function (newActiviteit) {
        newActiviteit.save(function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegeaan.", gegevens));
            } else {
                callback(resp("De activiteit is succesvol opgeslagen.", data));
                console.log(data);
            }
        });
    }
    var maakActiviteit = function () {
        var newActiviteit = new A();
        newActiviteit.naam = gegevens.naam;
        newActiviteit.creatorId = gegevens.creatorId;
        newActiviteit.subCategorieId = gegevens.subCategorieId;
        newActiviteit.doorloopTijd = gegevens.doorloopTijd;
        newActiviteit.intensiteit = gegevens.intensiteit;
        newActiviteit.puntenPerDeelnemer = gegevens.puntenPerDeelnemer;
        newActiviteit.groep = gegevens.groep;
        newActiviteit.omschrijving = gegevens.omschrijving;
        newActiviteit.gesloten = false;
        newActiviteit.deelnemers[0] = gegevens.creatorId;
        if (gegevens.doorloopTijd === 'eenmalig') {
            newActiviteit.datum = gegevens.datum;
        } else {
            newActiviteit.dagen = gegevens.dagen;
        }
        if (gegevens.groep) {
            newActiviteit.minPers = gegevens.minPers;
            newActiviteit.maxPers = gegevens.maxPers;
        } else {
            newActiviteit.minPers = 1;
            newActiviteit.maxPers = 1;
        }
        console.log(newActiviteit);
        slaActiviteitOp(newActiviteit);
    }
    var valideerIntensiteit = function () {
        if (gegevens.intensiteit === "beginner" || gegevens.intensiteit === "gevorderd" || gegevens.intensiteit === "expert") {
            maakActiviteit();
        } else {
            callback(resp("De gegeven intensiteit is niet valide.", gegevens));
        }
    }
    var valideerDoorloopTijd = function () {
        if (gegevens.doorloopTijd === "eenmalig" || gegevens.doorloopTijd === "wekelijks") {
            valideerIntensiteit();
        } else {
            callback(resp("De gegeven doorloop tijd is niet valide.", gegevens));
        }
    }
    var valideerSubCategorieId = function () {
        SC.find({_id : gegevens.subCategorieId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De gegeven subCategorie bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerDoorloopTijd();
                } else {
                    callback(resp("De gegeven subCategorie bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerCreatorId = function () {
        G.find({_id : gegevens.creatorId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De gegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerSubCategorieId();
                } else {
                    callback(resp("De gegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerNaam = function () {
        if (gegevens.naam.length > 4) {
            valideerCreatorId();
        } else {
            callback(resp("De gegeven naam is niet valide.", gegevens));
        }
    }
    var valideerVelden = function () {
        if (gegevens.naam && gegevens.creatorId && gegevens.subCategorieId && gegevens.intensiteit && gegevens.doorloopTijd && gegevens.minPers && gegevens.maxPers && gegevens.puntenPerDeelnemer) {
            valideerNaam();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", gegevens));
        }
    }
    valideerVelden();
};

exports.getActiviteit = function (_id, callback) {
    A.find({_id : _id}, function (error, data) {
        if (error) {
            console.log(error);
            callback(resp("De gezochte avtiviteit kan niet gevonden worden.", _id));
        } else {
            if (data[0]) {
                callback(resp("De gezochte avtiviteit is gevonden.", data));
            } else {
                callback(resp("De gezochte avtiviteit kan niet gevonden worden.", _id));  
            }
        }
    });
};

exports.getActiviteiten = function (callback) {
    A.find(function (error, data) {
        if (error) {
            console.log(error);
            callback(resp("De gezochte avtiviteiten kunnen niet gevonden worden.", _id));
        } else {
            callback(resp("De gezochte avtiviteiten zijn gevonden.", data));
        }
    });
};

exports.voegDeelnemerToe = function (gegevens, callback) {
    var act;
    var slaActOp = function() {
        act.save(function(error, data) {
            if (error) {
                console.log(error);
                callback(resp("Het toegevoegen aan de activiteit is mislukt.", gegevens));
            } else {
                callback(resp("Je bent toegevoegd aan de activiteit.", data));
            }
        });
    }
    var voegDeelnemerToeActiviteit = function() {
        act.deelnemers.push(gegevens._id);
        slaActOp();
    }
    var checkOfAlDeelnemer = function () {
        var i;
        for (i = 0; i < act.deelnemers.length; i += 1) {
            if (gegevens._id === act.deelnemers[i]) {
                callback(resp("Je doet al mee aan deze activiteit.", gegevens));
                return;
            }
        }
        voegDeelnemerToeActiviteit();
    }
    var valideerAct = function () {
        if (!act.groep) {
            callback(resp("De opgegeven activiteit is geen groepsactiviteit.", gegevens));
        } else if (act.deelnemers.length >= act.maxPers) {
            callback(resp("De opgegeven activiteit is al vol.", gegevens));
        } else {
            checkOfAlDeelnemer();
        }
    }
    var valideerActiviteit = function () {
        A.find({_id : gegevens.activiteitId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    act = data[0];
                    valideerAct();
                } else {
                    callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerActiviteit();
                } else {
                    callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerVelden = function () {
        if (gegevens.activiteitId && gegevens._id) {
            valideerGebruiker();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", gegevens));
        }
    }
    valideerVelden();
}

exports.verwijderDeelnemer = function (gegevens, callback) {
    var act;
    var slaActOp = function() {
        act.save(function(error, data) {
            if (error) {
                console.log(error);
                callback(resp("Het verwijderen uit de activiteit is mislukt.", gegevens));
            } else {
                callback(resp("Je bent verwijderd uit de activiteit.", data));
            }
        });
    }
    var checkOfDeelnemerEnVerwijder = function () {
        var i;
        for (i = 0; i < act.deelnemers.length; i += 1) {
            if (act.deelnemers[i] === gegevens._id) {
                act.deelnemers.splice(i,1);
            }
        }
        slaActOp();
    }
    var valideerActiviteit = function () {
        A.find({_id : gegevens.activiteitId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    act = data[0];
                    checkOfDeelnemerEnVerwijder();
                } else {
                    callback(resp("De opgegeven activiteit bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
            } else {
                if (data[0]) {
                    valideerActiviteit();
                } else {
                    callback(resp("De opgegeven gebruiker bestaat niet.", gegevens));
                }
            }
        });
    }
    var valideerVelden = function () {
        if (gegevens.activiteitId && gegevens._id) {
            valideerGebruiker();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", gegevens));
        }
    }
    valideerVelden();
}
