var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Activiteit

var ActiviteitSchema = mongoose.Schema({
    naam : {type : String, required : true},
    creatorId : {type : String, required : true},
    subCategorieId : {type : String, required : true},
    wekelijks : {type : [{
        beginTijd : {type : String, required : true},
        eindTijd : {type : String, required : true}
    }], required : false},
    eenmalig : {type : {
        beginTijd : {type : String, required : true},
        eindTijd : {type : String, required : true}
    }, required : false},
    intensiteit : {type : String, required : true},
    groep : {type : Boolean, required : false, default : false},
    doorloopTijd : {type : String, required : true},
    omschrijving : {type : String, required : false},
    gesloten : {type : Boolean, required : true},
    minPers : {type : Number, required : true},
    maxPers : {type : Number, required : true},
    deelnemers : {type : [], required : false},
    puntenPerDeelnemer : {type : Number, required : true},
    verzamelPlaats : {type : String, required : true},
    likes : {type : Number, required : false, default : 0},
    reacties : {type : [], required : false},
    aanmaakDatum : {type : Date, default : Date.now()}
}, {collection : "activiteiten"});

exports.A = mongoose.model('Activiteit', ActiviteitSchema);

// HoofdCategorie

var HoofdCategorieSchema = mongoose.Schema({
    naam : {type : String, required : true},
    icoon : {type : String, required : true},
}, {collection : "HoofdCategorieen"});

exports.HC = mongoose.model('HoofdCategorie', HoofdCategorieSchema);

// SubCategorie

var SubCategorieSchema = mongoose.Schema({
    naam : {type : String, required : true},
    punten : {type : Number, required : true},
    hoofdCategorieId : {type : String, required : true},
    iconImg : {type : String, required : true, default : "img/hardlopen.jpg"}
}, {collection : "SubCategorieen"});

exports.SC = mongoose.model('SubCategorie', SubCategorieSchema);

// Gebruiker

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

exports.G = mongoose.model('Gebruiker', GebruikerSchema);

// Meter

var MeterSchema = mongoose.Schema({
    doel : {type : String, required : true},
    puntenDoel : {type : Number, required : true},
    puntenTussenstand : {type : Number, required : true},
    doelGehaald : {type : Boolean}
}, {collection : "Meter"});

exports.M = mongoose.model('Meter', MeterSchema);