var mongoose = require('mongoose');
var GebruikerSchema = mongoose.Schema({
    naam : {type : String, required : true},
    achternaam : {type : String, required : true},
    email : {type : String, required : true},
    wachtwoord : {type : String, required : true},
}, {collection : "gebruikers"});

var Gebruiker = mongoose.model('Gebruiker', GebruikerSchema);
var exports = module.exports = {};

var response = function (message, data) {
    return {
        message : message,
        data : data
    }
}
exports.getActiviteiten = function (id, callback) {
    'use strict';
    Activiteit.find({lesNummer : id}, function (err, activiteiten) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de vragen is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de vragen is gelukt.", activiteiten));
        }
    });
}
