var exports = module.exports = {};
var A = require('./../models/mongooseSchemas').A;
var G = require('./../models/mongooseSchemas').G;
var HC = require('./../models/mongooseSchemas').HC;
var SC = require('./../models/mongooseSchemas').SC;
var M = require('./../models/mongooseSchemas').M;

var F = require('./../models/feedsAndStats');

var resp = function (message, success, data) {
    return {
        message : message,
        success : success,
        data : data
    }
}

var createFeed = function (gebruikerId, activiteitId, nieuws, datum) {
    var feed = {
        gebruikerId : gebruikerId,
        activiteitId : activiteitId,
        nieuws : nieuws,
        datum : datum
    };
    F.addFeed(feed);
}

exports.createActiviteit = function (gegevens, callback) {
    var slaActiviteitOp = function (newActiviteit) {
        newActiviteit.save(function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegeaan.", false, gegevens));
            } else {
                callback(resp("De activiteit is succesvol opgeslagen.", true, data));
                createFeed(gegevens.creatorId, data._id, "Heeft een activiteit aangemaakt:", new Date());
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
        newActiviteit.deelnemers = gegevens.deelnemers;
        if (gegevens.doorloopTijd === 'eenmalig') {
            newActiviteit.eenmalig = gegevens.eenmalig;
        } else {
            newActiviteit.wekelijks = gegevens.dagen;
        }
        if (gegevens.groep) {
            newActiviteit.minPers = gegevens.minPers;
            newActiviteit.maxPers = gegevens.maxPers;
        } else {
            newActiviteit.minPers = 1;
            newActiviteit.maxPers = 1;
        }
        newActiviteit.verzamelPlaats = gegevens.verzamelPlaats;
        slaActiviteitOp(newActiviteit);
    }
    var valideerIntensiteit = function () {
        if (gegevens.intensiteit === "beginner" || gegevens.intensiteit === "gevorderd" || gegevens.intensiteit === "expert") {
            maakActiviteit();
        } else {
            callback(resp("De gegeven intensiteit is niet valide.", false, gegevens));
        }
    }
    var valideerDoorloopTijd = function () {
        if (gegevens.doorloopTijd === "eenmalig" || gegevens.doorloopTijd === "wekelijks") {
            valideerIntensiteit();
        } else {
            callback(resp("De gegeven doorloop tijd is niet valide.", false, gegevens));
        }
    }
    var valideerSubCategorieId = function () {
        SC.find({_id : gegevens.subCategorieId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De gegeven subCategorie bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    valideerDoorloopTijd();
                } else {
                    callback(resp("De gegeven subCategorie bestaat niet.", false, gegevens));
                }
            }
        });
    }
    var valideerCreatorId = function () {
        G.find({_id : gegevens.creatorId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De gegeven gebruiker bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    valideerSubCategorieId();
                } else {
                    callback(resp("De gegeven gebruiker bestaat niet.", false, gegevens));
                }
            }
        });
    }
    var valideerNaam = function () {
        if (gegevens.naam.length > 4) {
            valideerCreatorId();
        } else {
            callback(resp("De gegeven naam is niet valide.", false, gegevens));
        }
    }
    var valideerVelden = function () {
        if (gegevens.naam && gegevens.creatorId && gegevens.subCategorieId && gegevens.intensiteit && gegevens.doorloopTijd && gegevens.minPers && gegevens.maxPers && gegevens.puntenPerDeelnemer) {
            valideerNaam();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", false, gegevens));
        }
    }
    valideerVelden();
};

exports.getActiviteit = function (_id, callback) {
    A.find({_id : _id}, function (error, data) {
        if (error) {
            console.log(error);
            callback(resp("De gezochte avtiviteit kan niet gevonden worden.", false, _id));
        } else {
            if (data[0]) {
                callback(resp("De gezochte avtiviteit is gevonden.", true, data));
            } else {
                callback(resp("De gezochte avtiviteit kan niet gevonden worden.", false, _id));  
            }
        }
    });
};

exports.getActiviteiten = function (callback) {
    var acts = [];
    var stuurActs = function () {
        console.log("De bende sturen..");
        var alleActs = [];
        for (i = 0; i < acts.length; i += 1) {
            alleActs[i] = {
                act : acts[i],
                creator : acts[i].creator,
                subCategorie : acts[i].subCategorie,
                deelnemers : acts[i].deelNemersGevuld,
                aantalDeelnemers : acts[i].setAantalDeelnemers,
                dagen : acts[i].dagen,
                datum : acts[i].datum
            }
        }

        console.log("Callbacken..");
        callback(resp("Hierbij de activiteiten", true, alleActs));
    }
    var berekenDichtstbijzijndeDatum = function (data) {
        console.log("De data bepalen..");
        var i, d, t = new Date(), nummer, v = 366, timeDiff, diffDays, theDate;
        for (i = 0; i < data.length; i += 1) {
            d = new Date(data[i].beginTijd);
            if (d > t) {
                timeDiff = Math.abs(t.getTime() - d.getTime());
                diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (diffDays < v) {
                    v = diffDays;
                    nummer = i;
                }
            }
        }
        theDate = new Date(data[nummer].beginTijd);
        theDate.setHours((theDate.getHours() + 1));
        return new Date(theDate.toString());
    }
    var setDagNamen = function () {
        console.log("De dagnamen instellen..");
        var i, x, dagen, newDate;
        for (i = 0; i < acts.length; i += 1) {
            dagen = [];
            if (acts[i].doorloopTijd === "eenmalig") {
                newDate = new Date(acts[i].eenmalig.beginTijd);
                newDate.setHours((newDate.getHours() + 1));
                acts[i].datum = new Date(newDate.toString());
                acts[i].dagen = [{
                    dagNaam : acts[i].eenmalig.beginTijd[0]+acts[i].eenmalig.beginTijd[1]+acts[i].eenmalig.beginTijd[2],
                    beginTijd : acts[i].eenmalig.beginTijd[16] + acts[i].eenmalig.beginTijd[17] + acts[i].eenmalig.beginTijd[18] + acts[i].eenmalig.beginTijd[19] + acts[i].eenmalig.beginTijd[20]
                }];
            } else if (acts[i].doorloopTijd === "wekelijks") {
                acts[i].datum = berekenDichtstbijzijndeDatum(acts[i].wekelijks);
                for (x = 0; x < acts[i].wekelijks.length; x += 1) {
                    dagen[x] = {
                        dagNaam : acts[i].wekelijks[x].beginTijd[0]+acts[i].wekelijks[x].beginTijd[1]+acts[i].wekelijks[x].beginTijd[2],
                        beginTijd : acts[i].wekelijks[x].beginTijd[16] + acts[i].wekelijks[x].beginTijd[17] + acts[i].wekelijks[x].beginTijd[18] + acts[i].wekelijks[x].beginTijd[19] + acts[i].wekelijks[x].beginTijd[20]
                    }
                }
                acts[i].dagen = dagen;
            }
        }
        stuurActs();
    }
    var setAantalDeelnemers = function () {
        console.log("Het aantal deelnemers bepalen..");
        var i;
        for (i = 0; i < acts.length; i += 1) {
            acts[i].setAantalDeelnemers = acts[i].deelnemers.length + "/" + acts[i].maxPers;
        }
        setDagNamen();
    }
    var voegSubCategorieenToe = function () {
        console.log("Categorieën toevoegen..");
        var i;
        var validateKlaar = acts.length - 1;
        var voegSubCategorieToe = function (nummer) {
            SC.find({_id : acts[nummer].subCategorieId}, function (error, res) {
                acts[nummer].subCategorie = res[0];
                if (nummer === validateKlaar) {
                    console.log("Ik mag verder..");
                    setAantalDeelnemers();
                }
            });
        }
        for (i = 0; i < acts.length; i += 1) {
            voegSubCategorieToe(i);
        }
    }
    var voegDeelnemersToe = function () {
        var voegToe = function (nummerX, nummerI) {
            G.findOne({_id : acts[nummerI].deelnemers[nummerX]}, function (error, data) {
                if (error) {
                    console.log(error);
                } else {
                    acts[nummerI].deelNemersGevuld.push(data);
                    console.log("I: " + nummerI);
                    console.log("X: " + nummerX);
                    if ((nummerI === acts.length - 1) && (nummerX === acts[nummerI].deelnemers.length - 1)) {
                        voegSubCategorieenToe();
                    }
                }
            }); 
        }
        var loopDeelnemers = function (nummer) {
            acts[nummer].deelNemersGevuld = [];
            var x;
            for (x = 0; x < acts[nummer].deelnemers.length; x += 1) {
                console.log("Loopen..");
                voegToe(x, nummer);
            }
        }
        var loop = function () {
            var i;
            for (i = 0; i < acts.length; i += 1) {
                if (acts[i].deelnemers.length > 0) {
                    loopDeelnemers(i);
                } else {
                    if (i === (acts.length - 1)) {
                        voegSubCategorieenToe(); 
                    }
                }
            }
        }
        loop();
    }
    var voegMakersToe = function () {
        console.log("Makers toevoegen..");
        var voegMakerToe = function (nummer) {
            var validateKlaar = acts.length - 1;
            G.find({_id : acts[nummer].creatorId}, function (error, res) {
                acts[nummer].creator = res[0];
                if (nummer === validateKlaar) {
                    voegDeelnemersToe();
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < acts.length; i += 1) {
                voegMakerToe(i);
            }
        }
        loop();
    }
    var getActs = function () {
        console.log("Activiteiten halen..");
        var i;
        A.find(function (error, data) {
            if (error) {
                console.log(error);
                console.log("Callbacken..");
                callback(resp("De gezochte avtiviteiten kunnen niet gevonden worden.", false, false));
            } else {
                if (data.length > 0) {
                    for (i = 0; i < data.length; i += 1) {
                        if (!(data[i].gesloten)) {
                            acts.push(data[i]);
                        }
                    }
                    voegMakersToe();
                } else {
                    console.log("Callbacken..");
                    callback(resp("Er zijn 0 activiteiten.", true, false));
                }
            }
        });
    }
    getActs();
};

exports.voegDeelnemerToe = function (gegevens, callback) {
    var act;
    var slaActOp = function() {
        act.save(function(error, data) {
            if (error) {
                console.log(error);
                callback(resp("Het toegevoegen aan de activiteit is mislukt.", false, gegevens));
            } else {
                callback(resp("Je bent toegevoegd aan de activiteit.", true, data));
                createFeed(gegevens._id, data._id, "Doet mee met: ", new Date());
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
                callback(resp("Je doet al mee aan deze activiteit.", true, gegevens));
                return;
            }
        }
        voegDeelnemerToeActiviteit();
    }
    var valideerAct = function () {
        if (!act.groep) {
            callback(resp("De opgegeven activiteit is geen groepsactiviteit.", false, gegevens));
        } else if (act.deelnemers.length >= act.maxPers) {
            callback(resp("De opgegeven activiteit is al vol.", false, gegevens));
        } else {
            checkOfAlDeelnemer();
        }
    }
    var valideerActiviteit = function () {
        A.find({_id : gegevens.activiteitId}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven activiteit bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    act = data[0];
                    valideerAct();
                } else {
                    callback(resp("De opgegeven activiteit bestaat niet.", false, gegevens));
                }
            }
        });
    }
    var valideerGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven gebruiker bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    valideerActiviteit();
                } else {
                    callback(resp("De opgegeven gebruiker bestaat niet.", false, gegevens));
                }
            }
        });
    }
    var valideerVelden = function () {
        if (gegevens.activiteitId && gegevens._id) {
            valideerGebruiker();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", false, gegevens));
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
                callback(resp("Het verwijderen uit de activiteit is mislukt.", false, gegevens));
            } else {
                callback(resp("Je bent verwijderd uit de activiteit.", true, data));
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
                callback(resp("De opgegeven activiteit bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    act = data[0];
                    checkOfDeelnemerEnVerwijder();
                } else {
                    callback(resp("De opgegeven activiteit bestaat niet.", false, gegevens));
                }
            }
        });
    }
    var valideerGebruiker = function () {
        G.find({_id : gegevens._id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("De opgegeven gebruiker bestaat niet.", false, gegevens));
            } else {
                if (data[0]) {
                    valideerActiviteit();
                } else {
                    callback(resp("De opgegeven gebruiker bestaat niet.", false, gegevens));
                }
            }
        });
    }
    var valideerVelden = function () {
        if (gegevens.activiteitId && gegevens._id) {
            valideerGebruiker();
        } else {
            callback(resp("Niet alle verplichte velden zijn gegeven.", false, gegevens));
        }
    }
    valideerVelden();
}

exports.filterActiviteiten = function (callback) {
    var actsEenmalig = [];
    var actsWekelijks = [];
    var meter;
    var slaMeterOp = function () {
        meter.save(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan.", false, false));
            } else {
                callback(resp("De activiteiten en de meter zijn geupdate.", true, res));
            }
        });
    }
    var updateMeter = function (punten) {
        console.log("Ik ga de meter updaten met " + punten + " punten.");
        if ((meter.puntenTussenstand + punten) >= meter.puntenDoel) {
            meter.puntenTussenstand = meter.puntenDoel;
            meter.doelGehaald = true;
        } else {
            meter.puntenTussenstand += punten;
            meter.doelGehaald = false;
        }
        console.log("Nieuwe meter-stand: " + meter.puntenTussenstand);
    }
    var makeNewFeed = function (gebruikerId, actId, datum) {
        createFeed(gebruikerId, actId, "Heeft de volgende activiteit gedaan:", datum);
    }
    var checkOfOudeDatumAct = function (datum) {
        var vandaag = new Date(Date.now());
        return (datum > vandaag);
    }
    var updateDeelnemers = function (deelnemers, punten, actId, datum) {
        var slaOp = function (gebruiker) {
            gebruiker.save(function (error, res) {
                if (error) {
                    console.log(error);
                }
            });
        }
        var updateDeelnemer = function (nummer) {
            var pkg;
            G.findOne({_id : deelnemers[nummer]}, function (error, gebruiker) {
                if (error) {
                    console.log(error);
                    console.log("De punten van de gebruiker kunnen niet worden geupdate..");
                } else {
                    pkg = {
                        punten : punten,
                        datumBehaald : datum,
                        activiteitId : actId
                    };
                    gebruiker.aantalPunten.push(pkg);
                    slaOp(gebruiker);
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < deelnemers.length; i += 1) {
                updateDeelnemer(i);
            }
        }
        loop();
    }
    var berekenEenmaligeActs = function () {
        var slaActiviteitOp = function (nummer) {
            var valideerKlaar = actsEenmalig.length - 1;
            actsEenmalig[nummer].save(function (error, res) {
                if (error) {
                    console.log(error);
                    callback(resp("Er is iets misgegaan.", false, false));
                } else {
                    if (nummer === valideerKlaar) {
                        slaMeterOp();
                    }
                }
            });
        }
        var slaActiviteitenOp = function () {
            var i;
            for (i = 0; i < actsEenmalig.length; i += 1) {
                slaActiviteitOp(i);
            }
        }
        var getPuntenEnSluitAct = function () {
            for (i = 0; i < actsEenmalig.length; i += 1) {
                if (!(actsEenmalig[i].gesloten)) {
                    if (!(checkOfOudeDatumAct(new Date(actsEenmalig[i].eenmalig.beginTijd)))) {
                        updateMeter((actsEenmalig[i].deelnemers.length * actsEenmalig[i].puntenPerDeelnemer));

                        updateDeelnemers(actsEenmalig[i].deelnemers, actsEenmalig[i].puntenPerDeelnemer, actsEenmalig[i]._id, new Date(actsEenmalig[i].eenmalig.beginTijd));

                        makeNewFeed(actsEenmalig[i].creatorId, actsEenmalig[i]._id, new Date(actsEenmalig[i].eenmalig.beginTijd));
                        actsEenmalig[i].gesloten = true;
                    }
                }
            }
            slaActiviteitenOp();
        }
        getPuntenEnSluitAct();
    }
    var berekenNieuweDataWekelijkseActs = function () {
        var slaActiviteitOp = function (nummer) {
            var valideerKlaar = actsWekelijks.length - 1;
            A.find({_id : actsWekelijks[nummer]._id}, function (error, res) {
                if (error) {
                    console.log(error);
                } else {
                    res[0].wekelijks = actsWekelijks[nummer].wekelijks;
                    res[0].save(function (error, res) {
                        if (error) {
                            console.log(error);
                        } else {
                            if (nummer === valideerKlaar) {
                                berekenEenmaligeActs();
                            }
                        }
                    });
                }
            });
        }
        var slaActiviteitenOp = function () {
            var i;
            for (i = 0; i < actsWekelijks.length; i += 1) {
                slaActiviteitOp(i);
            }
        }
        var berekenNieuweDatum = function (data) {
            var oudeBeginTijd = new Date(data.beginTijd);
            var nieuweBeginTijd = new Date(oudeBeginTijd);
            nieuweBeginTijd.setDate(oudeBeginTijd.getDate()+7);
            console.log("Ik ga nieuwe data berekenen. " + (new Date(data.beginTijd)));
            console.log("Ik ga nieuwe data berekenen. " + nieuweBeginTijd);

            var oudeEindTijd = new Date(data.eindTijd);
            var nieuweEindTijd = new Date(oudeEindTijd);
            nieuweEindTijd.setDate(oudeEindTijd.getDate()+7);
            console.log("Ik ga nieuwe data berekenen. " + (new Date(data.eindTijd)));
            console.log("Ik ga nieuwe data berekenen. " + nieuweEindTijd);

            return {
                beginTijd : nieuweBeginTijd.toString(),
                eindTijd : nieuweEindTijd.toString()
            }
        }
        var nieuweDataActsWekelijks = function () {
            var i, x;
            for (i = 0; i < actsWekelijks.length; i += 1) {
                for (x = 0; x < actsWekelijks[i].wekelijks.length; x += 1) {
                    if (!(checkOfOudeDatumAct(new Date(actsWekelijks[i].wekelijks[x].beginTijd)))) {
                        updateMeter((actsWekelijks[i].deelnemers.length * actsWekelijks[i].puntenPerDeelnemer));

                        updateDeelnemers(actsWekelijks[i].deelnemers, actsWekelijks[i].puntenPerDeelnemer, actsWekelijks[i]._id, new Date(actsWekelijks[i].wekelijks[x].beginTijd));

                        makeNewFeed(actsWekelijks[i].creatorId, actsWekelijks[i]._id, new Date(actsWekelijks[i].wekelijks[x].beginTijd));
                        actsWekelijks[i].wekelijks[x] = berekenNieuweDatum(actsWekelijks[i].wekelijks[x]);
                    }
                }
            }
            slaActiviteitenOp();
        }
        nieuweDataActsWekelijks();
    }
    var filterActs = function (acts) {
        var i;
        for (i = 0; i < acts.length; i += 1) {
            if (acts[i].doorloopTijd === "wekelijks") {
                actsWekelijks.push(acts[i]);
            } else if (acts[i].doorloopTijd === "eenmalig") {
                actsEenmalig.push(acts[i]);
            }
        }
        berekenNieuweDataWekelijkseActs();
    }
    var getActiviteiten = function () {
        A.find(function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("Er is een error opgetreden.", false, false));
            } else {
                filterActs(data);
            }
        });
    }
    var getMeter = function () {
        M.find(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is een error opgetreden.", false, false));
            } else {
                meter = res[0];
                getActiviteiten();
            }
        });
    }
    getMeter();
}
