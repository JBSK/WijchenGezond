var exports = module.exports = {};
var FAS = require('./../models/mongooseSchemas').FAS;
var G = require('./../models/mongooseSchemas').G;
var A = require('./../models/mongooseSchemas').A;
var SC = require('./../models/mongooseSchemas').SC;

var resp = function (message, success, data) {
    return {
        message : message,
        success : success,
        data : data
    }
}

exports.getFeeds = function (callback) {
    var feeds = [];

    var sendFeeds = function () {
        callback(resp("De feeds zijn gevonden..", true, feeds));
    }

    var voegDeelnemersToe = function () {
        var nummersMetDeelnemers = [];
        var gechecked = [];
        var voegDeelnemersToeAanFeeds = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gechecked.length; x += 1) {
                    if (gechecked[x].feed._id === feeds[i].feed._id) {
                        feeds[i] = gechecked[x];
                    }
                }
            }
            sendFeeds();
        }
        var loopNummersMetDeelnemers = function () {
            var checkOfKlaar = function () {
                if (gechecked.length === nummersMetDeelnemers.length) {
                    voegDeelnemersToeAanFeeds();
                }
            }
            var voegDeelnemerToe = function (feed, id, nummer) {
                var d;
                G.find({_id : id}, function (error, res) {
                    if (error) {
                        console.log(error);
                        callback(resp("Er is iets misgegaan..", false, false));
                    } else {
                        d = res[0];
                        feed.deelnemers.push(d);
                        if (nummer === feed.activiteit.deelnemers.length - 1) {
                            gechecked.push(feed);
                            checkOfKlaar();
                        }
                    }
                });
            }

            var loopDoorDeelnemers = function (feed) {
                var i;
                for (i = 0; i < feed.activiteit.deelnemers.length; i += 1) {
                    voegDeelnemerToe(feed, feed.activiteit.deelnemers[i], i);
                }
            }

            var loop = function () {
                var i, f;
                for (i = 0; i < nummersMetDeelnemers.length; i += 1) {
                    f = feeds[nummersMetDeelnemers[i]];
                    loopDoorDeelnemers(f);
                }
            }
            loop();
        }

        var checkOpDeelnemers = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                if (feeds[i].activiteit.deelnemers.length > 0) {
                    nummersMetDeelnemers.push(i);
                }
            }
            if (nummersMetDeelnemers.length > 0) {
                loopNummersMetDeelnemers();
            } else {
                sendFeeds();
            }
        }
        checkOpDeelnemers();
    }


    var voegReactiesEnGebruikersToe = function () {
        var nummersMetReacties = [];
        var gechecked = [];
        var voegReactiesToeAanFeeds = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gechecked.length; x += 1) {
                    if (gechecked[x].feed._id === feeds[i].feed._id) {
                        feeds[i] = gechecked[x];
                    }
                }
            }
            voegDeelnemersToe();
        }
        var loopNummersMetReacties = function () {
            var checkOfKlaar = function () {
                if (gechecked.length === nummersMetReacties.length) {
                    voegReactiesToeAanFeeds();
                }
            }
            var voegReactieEnGebruikerToe = function (feed, reactie, nummer) {
                var r;
                G.find({_id : reactie.gebruikerId}, function (error, res) {
                    if (error) {
                        console.log(error);
                        callback(resp("Er is iets misgegaan..", false, false));
                    } else {
                        r = {
                            gebruiker : res[0],
                            datum : reactie.datum,
                            reactie : reactie.reactie
                        }
                        feed.reacties.push(r);
                        if (nummer === feed.feed.reacties.length - 1) {
                            gechecked.push(feed);
                            checkOfKlaar();
                        }
                    }
                });
            }

            var loopDoorReacties = function (feed) {
                var i;
                for (i = 0; i < feed.feed.reacties.length; i += 1) {
                    voegReactieEnGebruikerToe(feed, feed.feed.reacties[i], i);
                }
            }

            var loop = function () {
                var i, f;
                for (i = 0; i < nummersMetReacties.length; i += 1) {
                    f = feeds[nummersMetReacties[i]];
                    loopDoorReacties(f);
                }
            }
            loop();
        }

        var checkOpReacties = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                if (feeds[i].feed.reacties.length > 0) {
                    nummersMetReacties.push(i);
                }
            }
            if (nummersMetReacties.length > 0) {
                loopNummersMetReacties();
            } else {
                voegDeelnemersToe();
            }
        }
        checkOpReacties();
    }
    var makersToevoegen = function () {
        var voegMakerToe = function (nummer) {
            G.find({_id : feeds[nummer].feed.gebruikerId}, function (error, res) {
                if (error) {
                    console.log(error);
                    callback(resp("Er is iets misgegaan.", false, false));
                } else {
                    feeds[nummer].maker = res[0];
                    if (nummer === feeds.length - 1) {
                        voegReactiesEnGebruikersToe();
                    }
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                voegMakerToe(i);
            }
        }
        loop();
    }

    var activiteitenToevoegen = function () {
        var voegActToe = function (nummer) {
            A.find({_id : feeds[nummer].feed.activiteitId}, function (error, res) {
                if (error) {
                    console.log(error);
                    callback(resp("Er is iets misgegaan.", false, false));
                } else {
                    feeds[nummer].activiteit = res[0];
                    feeds[nummer].aantalDeelnemers = res[0].deelnemers.length;

                    SC.findOne({_id : res[0].subCategorieId}, function (error, data) {
                        if (error) {
                            console.log(error);
                            callback(resp("Er is iets misgegaan.", false, false));
                        } else {
                            feeds[nummer].subCategorie = data;
                            if (nummer === feeds.length - 1) {
                                makersToevoegen();
                            }
                        }
                    });
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                voegActToe(i);
            }
        }
        loop();
    }

    var feedsVullen = function () {
        var i;
        FAS.find(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan.", false, false));
            } else {
                for (i = 0; i < res.length; i += 1) {
                    feeds.push({
                        feed : res[i],
                        deelnemers : [],
                        reacties : [],
                        aantalDeelnemers : 0,
                        datum : res[i].datum
                    });
                }
                activiteitenToevoegen();
            }
        });
    }
    feedsVullen();
}

exports.getFeedsGebruiker = function (id, callback) {
    var feeds = [];
    var gebruiker = {};

    var sendFeeds = function (filteredFeeds) {
        var i, x, filteredFs = [], inFeeds;
        if (filteredFeeds.length > 0) {
            filteredFs = [filteredFeeds[0]];
            for (i = 0; i < filteredFeeds.length; i += 1) {
                inFeeds = false;
                for (x = 0; x < filteredFs.length; x += 1) {
                    if (filteredFeeds[i].feed._id.toString() === filteredFs[x].feed._id.toString()) {
                        inFeeds = true;
                    }
                }
                if (!inFeeds) {
                    filteredFs.push(filteredFeeds[i]);
                }
            }
            filteredFeeds = filteredFs;
        }
        callback(resp("De feeds zijn gevonden..", true, filteredFeeds));
    }

    var filterFeeds = function () {
        var filteredFeeds = [];
        var checkOfMaker = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                console.log(gebruiker._id + " en " + feeds[i].maker._id);
                console.log(gebruiker._id.toString() === feeds[i].maker._id.toString());
                if (gebruiker._id.toString() === feeds[i].maker._id.toString()) {
                    filteredFeeds.push(feeds[i]);
                }
            }
        }
        var checkOfDeelnemer = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < feeds[i].deelnemers.length; x += 1) {
                    if (feeds[i].deelnemers[x]._id.toString() === gebruiker._id.toString()) {
                        filteredFeeds.push(feeds[i]);
                    }
                }
            }
        }
        var filterDoubleFeeds = function() {
            var i, x, selectedId;
            for (i = 0; i < filteredFeeds.length; i += 1) {
                selectedId = filteredFeeds[i].feed._id.toString();
                for (x = (i + 1); x < filteredFeeds.length; x += 1) {
                    if (selectedId === filteredFeeds[x].feed._id.toString()) {
                        filteredFeeds.splice(x,1);
                    }
                }
            }
        }
        checkOfMaker();
        checkOfDeelnemer();
        filterDoubleFeeds();
        sendFeeds(filteredFeeds);
    }

    var voegDeelnemersToe = function () {
        var nummersMetDeelnemers = [];
        var gechecked = [];
        var voegDeelnemersToeAanFeeds = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gechecked.length; x += 1) {
                    if (gechecked[x].feed._id === feeds[i].feed._id) {
                        feeds[i] = gechecked[x];
                    }
                }
            }
            filterFeeds();
        }
        var loopNummersMetDeelnemers = function () {
            var checkOfKlaar = function () {
                if (gechecked.length === nummersMetDeelnemers.length) {
                    voegDeelnemersToeAanFeeds();
                }
            }
            var voegDeelnemerToe = function (feed, id, nummer) {
                var d;
                G.find({_id : id}, function (error, res) {
                    if (error) {
                        console.log(error);
                        callback(resp("Er is iets misgegaan..", false, false));
                    } else {
                        d = res[0];
                        feed.deelnemers.push(d);
                        if (nummer === feed.activiteit.deelnemers.length - 1) {
                            gechecked.push(feed);
                            checkOfKlaar();
                        }
                    }
                });
            }

            var loopDoorDeelnemers = function (feed) {
                var i;
                for (i = 0; i < feed.activiteit.deelnemers.length; i += 1) {
                    voegDeelnemerToe(feed, feed.activiteit.deelnemers[i], i);
                }
            }

            var loop = function () {
                var i, f;
                for (i = 0; i < nummersMetDeelnemers.length; i += 1) {
                    f = feeds[nummersMetDeelnemers[i]];
                    loopDoorDeelnemers(f);
                }
            }
            loop();
        }

        var checkOpDeelnemers = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                if (feeds[i].activiteit.deelnemers.length > 0) {
                    nummersMetDeelnemers.push(i);
                }
            }
            if (nummersMetDeelnemers.length > 0) {
                loopNummersMetDeelnemers();
            } else {
                filterFeeds();
            }
        }
        checkOpDeelnemers();
    }


    var voegReactiesEnGebruikersToe = function () {
        var nummersMetReacties = [];
        var gechecked = [];
        var voegReactiesToeAanFeeds = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gechecked.length; x += 1) {
                    if (gechecked[x].feed._id === feeds[i].feed._id) {
                        feeds[i] = gechecked[x];
                    }
                }
            }
            voegDeelnemersToe();
        }
        var loopNummersMetReacties = function () {
            var checkOfKlaar = function () {
                if (gechecked.length === nummersMetReacties.length) {
                    voegReactiesToeAanFeeds();
                }
            }
            var voegReactieEnGebruikerToe = function (feed, reactie, nummer) {
                var r;
                G.find({_id : reactie.gebruikerId}, function (error, res) {
                    if (error) {
                        console.log(error);
                        callback(resp("Er is iets misgegaan..", false, false));
                    } else {
                        r = {
                            gebruiker : res[0],
                            datum : reactie.datum,
                            reactie : reactie.reactie
                        }
                        feed.reacties.push(r);
                        if (nummer === feed.feed.reacties.length - 1) {
                            gechecked.push(feed);
                            checkOfKlaar();
                        }
                    }
                });
            }

            var loopDoorReacties = function (feed) {
                var i;
                for (i = 0; i < feed.feed.reacties.length; i += 1) {
                    voegReactieEnGebruikerToe(feed, feed.feed.reacties[i], i);
                }
            }

            var loop = function () {
                var i, f;
                for (i = 0; i < nummersMetReacties.length; i += 1) {
                    f = feeds[nummersMetReacties[i]];
                    loopDoorReacties(f);
                }
            }
            loop();
        }

        var checkOpReacties = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                if (feeds[i].feed.reacties.length > 0) {
                    nummersMetReacties.push(i);
                }
            }
            if (nummersMetReacties.length > 0) {
                loopNummersMetReacties();
            } else {
                voegDeelnemersToe();
            }
        }
        checkOpReacties();
    }
    var makersToevoegen = function () {
        var voegMakerToe = function (nummer) {
            G.find({_id : feeds[nummer].feed.gebruikerId}, function (error, res) {
                if (error) {
                    console.log(error);
                    callback(resp("Er is iets misgegaan.", false, false));
                } else {
                    feeds[nummer].maker = res[0];
                    if (nummer === feeds.length - 1) {
                        voegReactiesEnGebruikersToe();
                    }
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                voegMakerToe(i);
            }
        }
        loop();
    }

    var activiteitenToevoegen = function () {
        var voegActToe = function (nummer) {
            A.find({_id : feeds[nummer].feed.activiteitId}, function (error, res) {
                if (error) {
                    console.log(error);
                    callback(resp("Er is iets misgegaan.", false, false));
                } else {
                    feeds[nummer].activiteit = res[0];
                    feeds[nummer].aantalDeelnemers = res[0].deelnemers.length;

                    SC.findOne({_id : res[0].subCategorieId}, function (error, data) {
                        if (error) {
                            console.log(error);
                            callback(resp("Er is iets misgegaan.", false, false));
                        } else {
                            feeds[nummer].subCategorie = data;
                            if (nummer === feeds.length - 1) {
                                makersToevoegen();
                            }
                        }
                    });
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                voegActToe(i);
            }
        }
        loop();
    }

    var feedsVullen = function () {
        var i;
        FAS.find(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan.", false, false));
            } else {
                for (i = 0; i < res.length; i += 1) {
                    feeds.push({
                        feed : res[i],
                        deelnemers : [],
                        reacties : [],
                        aantalDeelnemers : 0,
                        datum : res[i].datum
                    });
                }
                activiteitenToevoegen();
            }
        });
    }
    var checkOfGebruikerBestaat = function () {
        G.findOne({_id : id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan..", false, false));
            } else {
                if (data) {
                    gebruiker = data;
                    feedsVullen();
                } else {
                    callback(resp("De gebruiker waar u naar zoekt bestaat niet..", false, false));
                }
            }
        });
    }
    checkOfGebruikerBestaat();
}

exports.getFeedsGebruikerVrienden = function (id, callback) {
    var feeds = [];
    var gebruiker = {};

    var sendFeeds = function (filteredFeeds) {
        var i, x, filteredFs = [], inFeeds;
        if (filteredFeeds.length > 0) {
            filteredFs = [filteredFeeds[0]];
            for (i = 0; i < filteredFeeds.length; i += 1) {
                inFeeds = false;
                for (x = 0; x < filteredFs.length; x += 1) {
                    if (filteredFeeds[i].feed._id.toString() === filteredFs[x].feed._id.toString()) {
                        inFeeds = true;
                    }
                }
                if (!inFeeds) {
                    filteredFs.push(filteredFeeds[i]);
                }
            }
            filteredFeeds = filteredFs;
        }
        callback(resp("De feeds zijn gevonden..", true, filteredFeeds));
    }

    var filterFeeds = function () {
        var filteredFeeds = [];
        var checkOfMaker = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                if (gebruiker._id.toString() === feeds[i].maker._id.toString()) {
                    filteredFeeds.push(feeds[i]);
                }
            }
        }
        var checkOfDeelnemer = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < feeds[i].deelnemers.length; x += 1) {
                    if (feeds[i].deelnemers[x]._id.toString() === gebruiker._id.toString()) {
                        filteredFeeds.push(feeds[i]);
                    }
                }
            }
        }
        var checkOfVriendenMaker = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gebruiker.vrienden.length; x += 1) {
                    if (gebruiker.vrienden[x].toString() === feeds[i].maker._id.toString()) {
                        filteredFeeds.push(feeds[i]);
                    }
                }
            }
        }
        var checkOfvriendenDeelnemer = function () {
            var i, x, y;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gebruiker.vrienden.length; x += 1) {
                    for (y = 0; y < feeds[i].deelnemers.length; y += 1) {
                        if (gebruiker.vrienden[x].toString() === feeds[i].deelnemers[y]._id.toString()) {
                            filteredFeeds.push(feeds[i]);
                        }
                    }
                }
            }
        }
        var filterDoubleFeeds = function() {
            var i, x, selectedId;
            for (i = 0; i < filteredFeeds.length; i += 1) {
                selectedId = filteredFeeds[i].feed._id.toString();
                for (x = (i + 1); x < filteredFeeds.length; x += 1) {
                    if (selectedId === filteredFeeds[x].feed._id.toString()) {
                        filteredFeeds.splice(x,1);
                    }
                }
            }
        }
        checkOfMaker();
        checkOfDeelnemer();
        checkOfVriendenMaker();
        checkOfvriendenDeelnemer();
        filterDoubleFeeds();
        sendFeeds(filteredFeeds);
    }

    var voegDeelnemersToe = function () {
        var nummersMetDeelnemers = [];
        var gechecked = [];
        var voegDeelnemersToeAanFeeds = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gechecked.length; x += 1) {
                    if (gechecked[x].feed._id === feeds[i].feed._id) {
                        feeds[i] = gechecked[x];
                    }
                }
            }
            filterFeeds();
        }
        var loopNummersMetDeelnemers = function () {
            var checkOfKlaar = function () {
                if (gechecked.length === nummersMetDeelnemers.length) {
                    voegDeelnemersToeAanFeeds();
                }
            }
            var voegDeelnemerToe = function (feed, id, nummer) {
                var d;
                G.find({_id : id}, function (error, res) {
                    if (error) {
                        console.log(error);
                        callback(resp("Er is iets misgegaan..", false, false));
                    } else {
                        d = res[0];
                        feed.deelnemers.push(d);
                        if (nummer === feed.activiteit.deelnemers.length - 1) {
                            gechecked.push(feed);
                            checkOfKlaar();
                        }
                    }
                });
            }

            var loopDoorDeelnemers = function (feed) {
                var i;
                for (i = 0; i < feed.activiteit.deelnemers.length; i += 1) {
                    voegDeelnemerToe(feed, feed.activiteit.deelnemers[i], i);
                }
            }

            var loop = function () {
                var i, f;
                for (i = 0; i < nummersMetDeelnemers.length; i += 1) {
                    f = feeds[nummersMetDeelnemers[i]];
                    loopDoorDeelnemers(f);
                }
            }
            loop();
        }

        var checkOpDeelnemers = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                if (feeds[i].activiteit.deelnemers.length > 0) {
                    nummersMetDeelnemers.push(i);
                }
            }
            if (nummersMetDeelnemers.length > 0) {
                loopNummersMetDeelnemers();
            } else {
                filterFeeds();
            }
        }
        checkOpDeelnemers();
    }


    var voegReactiesEnGebruikersToe = function () {
        var nummersMetReacties = [];
        var gechecked = [];
        var voegReactiesToeAanFeeds = function () {
            var i, x;
            for (i = 0; i < feeds.length; i += 1) {
                for (x = 0; x < gechecked.length; x += 1) {
                    if (gechecked[x].feed._id === feeds[i].feed._id) {
                        feeds[i] = gechecked[x];
                    }
                }
            }
            voegDeelnemersToe();
        }
        var loopNummersMetReacties = function () {
            var checkOfKlaar = function () {
                if (gechecked.length === nummersMetReacties.length) {
                    voegReactiesToeAanFeeds();
                }
            }
            var voegReactieEnGebruikerToe = function (feed, reactie, nummer) {
                var r;
                G.find({_id : reactie.gebruikerId}, function (error, res) {
                    if (error) {
                        console.log(error);
                        callback(resp("Er is iets misgegaan..", false, false));
                    } else {
                        r = {
                            gebruiker : res[0],
                            datum : reactie.datum,
                            reactie : reactie.reactie
                        }
                        feed.reacties.push(r);
                        if (nummer === feed.feed.reacties.length - 1) {
                            gechecked.push(feed);
                            checkOfKlaar();
                        }
                    }
                });
            }

            var loopDoorReacties = function (feed) {
                var i;
                for (i = 0; i < feed.feed.reacties.length; i += 1) {
                    voegReactieEnGebruikerToe(feed, feed.feed.reacties[i], i);
                }
            }

            var loop = function () {
                var i, f;
                for (i = 0; i < nummersMetReacties.length; i += 1) {
                    f = feeds[nummersMetReacties[i]];
                    loopDoorReacties(f);
                }
            }
            loop();
        }

        var checkOpReacties = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                if (feeds[i].feed.reacties.length > 0) {
                    nummersMetReacties.push(i);
                }
            }
            if (nummersMetReacties.length > 0) {
                loopNummersMetReacties();
            } else {
                voegDeelnemersToe();
            }
        }
        checkOpReacties();
    }
    var makersToevoegen = function () {
        var voegMakerToe = function (nummer) {
            G.find({_id : feeds[nummer].feed.gebruikerId}, function (error, res) {
                if (error) {
                    console.log(error);
                    callback(resp("Er is iets misgegaan.", false, false));
                } else {
                    feeds[nummer].maker = res[0];
                    if (nummer === feeds.length - 1) {
                        voegReactiesEnGebruikersToe();
                    }
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                voegMakerToe(i);
            }
        }
        loop();
    }

    var activiteitenToevoegen = function () {
        var voegActToe = function (nummer) {
            A.find({_id : feeds[nummer].feed.activiteitId}, function (error, res) {
                if (error) {
                    console.log(error);
                    callback(resp("Er is iets misgegaan.", false, false));
                } else {
                    feeds[nummer].activiteit = res[0];
                    feeds[nummer].aantalDeelnemers = res[0].deelnemers.length;

                    SC.findOne({_id : res[0].subCategorieId}, function (error, data) {
                        if (error) {
                            console.log(error);
                            callback(resp("Er is iets misgegaan.", false, false));
                        } else {
                            feeds[nummer].subCategorie = data;
                            if (nummer === feeds.length - 1) {
                                makersToevoegen();
                            }
                        }
                    });
                }
            });
        }
        var loop = function () {
            var i;
            for (i = 0; i < feeds.length; i += 1) {
                voegActToe(i);
            }
        }
        loop();
    }

    var feedsVullen = function () {
        var i;
        FAS.find(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan.", false, false));
            } else {
                for (i = 0; i < res.length; i += 1) {
                    feeds.push({
                        feed : res[i],
                        deelnemers : [],
                        reacties : [],
                        aantalDeelnemers : 0,
                        datum : res[i].datum
                    });
                }
                activiteitenToevoegen();
            }
        });
    }
    var checkOfGebruikerBestaat = function () {
        G.findOne({_id : id}, function (error, data) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan..", false, false));
            } else {
                if (data) {
                    gebruiker = data;
                    feedsVullen();
                } else {
                    callback(resp("De gebruiker waar u naar zoekt bestaat niet..", false, false));
                }
            }
        });
    }
    checkOfGebruikerBestaat();
}


exports.addFeed = function (feed) {
    var newFeed;
    var slaFeedOp = function () {
        console.log("Opslaan");
        newFeed.save(function (error, res) {
            if (error) {
                console.log(error);
            } else {
                console.log("Feed toegevoegd");
            }
        });
    }
    var maakNewFeed = function () {
        console.log("Nieuwe feed maken");
        newFeed = new FAS();
        newFeed.gebruikerId = feed.gebruikerId;
        newFeed.activiteitId = feed.activiteitId;
        newFeed.datum = feed.datum;
        newFeed.likes = 0;
        newFeed.nieuws = feed.nieuws;
        slaFeedOp();
    }
    var checkOfActiviteitBestaat = function () {
        console.log("Activiteit checken..");
        A.find({_id : feed.activiteitId}, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                if (data[0]) {
                    maakNewFeed();
                } else {
                    console.log("De activiteit bestaat niet");
                }
            }
        });
    }
    var checkOfGebruikerBestaat = function () {
        console.log("Gebruiker checken..");
        G.find({_id : feed.gebruikerId}, function (error, data) {
            if (error) {
                console.log(error);
            } else {
                if (data[0]) {
                    checkOfActiviteitBestaat();
                } else {
                    console.log("De gebruiker bestaat niet");
                }
            }
        });
    }
    checkOfGebruikerBestaat();
}

exports.react = function (reactie, callback) {
    var feed;
    var slaFeedOp = function () {
        feed.save(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan..", false, false));
            } else {
                callback(resp("De reactie is opgeslagen", true, res));
            }
        });
    }
    var maakEnVoegReactieToe = function () {
        var newReactie = {
            gebruikerId : reactie.gebruikerId,
            reactie : reactie.reactie,
            datum : new Date()
        }
        feed.reacties.push(newReactie);
        slaFeedOp();
        console.log(feed);
    }
    var valideerReactie = function () {
        //Reactie valideren
        maakEnVoegReactieToe();
    }
    var getFeed = function () {
        FAS.find({_id : reactie.feedId}, function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan..", false, false));
            } else {
                if (res[0]) {
                    feed = res[0];
                    valideerReactie();
                } else {
                    callback(resp("De gegeven feed bestaat niet..", false, false));
                }
            }
        });
    }
    var valideerGebruiker = function () {
        G.find({_id : reactie.gebruikerId}, function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan..", false, false));
            } else {
                if (res[0]) {
                    getFeed();
                } else {
                    callback(resp("De gegeven gebruiker bestaat niet..", false, false));
                }
            }
        });
    }
    var valideerVelden = function () {
        console.log(reactie);
        if (reactie.feedId && reactie.gebruikerId && reactie.reactie) {
            valideerGebruiker();
        } else {
            callback(resp("Niet alle vereiste velden zijn ingevuld", false, false));
        }
    }
    valideerVelden();
}
