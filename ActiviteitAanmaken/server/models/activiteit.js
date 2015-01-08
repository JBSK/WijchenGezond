var mongoose = require('mongoose');
var ActiviteitSchema = mongoose.Schema({
    naam : {type : String, required : true},
    creatorId : {type : String, required : true},
    subCategorieId : {type : String, required : true},
    datum : {type : Date, required : false},
    dagen : {type : [], required : false},
    intensiteit : {type : String, required : true},
    groep : {type : Boolean, required : true},
    doorloopTijd : {type : String, required : true},
    omschrijving : {type : String, required : true},
    gesloten : {type : Boolean, required : true},
    minPers : {type : Number, required : true},
    maxPers : {type : Number, required : true},
    aantalPers : {type : [], required : true},
}, {collection : "activiteiten"});

var Activiteit = mongoose.model('Activiteit', ActiviteitSchema);
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
