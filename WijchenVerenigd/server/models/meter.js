var exports = module.exports = {};
var A = require('./../models/mongooseSchemas').A;
var G = require('./../models/mongooseSchemas').G;
var HC = require('./../models/mongooseSchemas').HC;
var SC = require('./../models/mongooseSchemas').SC;
var M = require('./../models/mongooseSchemas').M;

var resp = function (message, success, data) {
    return {
        message : message,
        success : success,
        data : data
    }
}

exports.getMeter = function (callback) {
    M.find(function (error, res) {
        if (error) {
            console.log(error);
            callback(resp("De meter kan niet worden gevonden door een fout :(!", false, false));
        } else {
            if (res[0]) {
                callback(resp("De meter is gevonden", true, res[0]));
            } else {
                callback(resp("Er bestaat nog geen meter of doel..", false, false));
            }
        }
    });
}
exports.addPunten = function (gegevens, callback) {
    var punten = gegevens.punten;
    var meter;
    var slaMeterOp = function () {
        meter.save(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("Er is iets misgegaan :(..", false, false));
            } else {
                callback(resp("De punten zijn toegevoegd! Goed bezig!", true, res));
            }
        });
    }
    var checkOfDoelGehaald = function () {
        var p = parseInt(punten);
        if ((meter.puntenTussenstand + p) >= meter.puntenDoel) {
            meter.puntenTussenstand = meter.puntenDoel;
            meter.doelGehaald = true;
            slaMeterOp();
        } else {
            meter.puntenTussenstand += p;
            meter.doelGehaald = false;
            slaMeterOp();
        }
    }
    var getMeter = function () {
        M.find(function (error, res) {
            if (error) {
                console.log(error);
                callback(resp("De meter kan niet worden gevonden door een fout :(!", false, false));
            } else {
                if (res[0]) {
                    meter = res[0];
                    checkOfDoelGehaald();
                } else {
                    callback(resp("Er bestaat nog geen meter of doel..", false, false));
                }
            }
        });
    }
    var checkOfNummer = function () {
        if (typeof parseInt(punten) === "number") {
            getMeter();
        } else {
            callback(resp("Je hebt geen getal meegegeven", false, false));
        }
    }
    checkOfNummer();
}
