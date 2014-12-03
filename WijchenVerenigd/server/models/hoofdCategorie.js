var mongoose = require('mongoose');
var HoofdCategorieSchema = mongoose.Schema({
    naam : {type : String, required : true},
    icoon : {type : String, required : true},
}, {collection : "HoofdCategorieen"});

var HoofdCategorie = mongoose.model('HoofdCategorie', HoofdCategorieSchema);
var exports = module.exports = {};

var response = function (message, data) {
    return {
        message : message,
        data : data
    }
}

exports.getHoofdCategorie = function (id, callback) {
    'use strict';
    HoofdCategorie.find({_id : id}, function (err, hoofdCategorie) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de hoofdcategorie is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de hoofdcategorie is gelukt.", hoofdCategorie));
        }
    });
}

exports.getHoofdCategorieen = function (callback) {
    'use strict';
    HoofdCategorie.find(function (err, hoofdCategorieen) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de hoofdcategorieen is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de hoofdcategorieen is gelukt.", hoofdCategorieen));
        }
    });
}

exports.deleteHoofdCategorie = function (id, callback) {
    'use strict';
    HoofdCategorie.remove({_id : id}).exec(function (err) {
        if (err) {
            callback(response("Het verwijderen van de hoofdcategorie is mislukt.", {}));
        } else {
            callback(response("Het verwijderen van de hoofdcategorie is gelukt.", {}));
        }
    });
}

exports.postHoofdCategorie = function (body, callback) {
    'use strict';
    var newCat = new HoofdCategorie();
    newCat.naam = body.naam;
    newCat.icoon = body.icoon;
    newCat.save(function (err, hoofdCategorie) {
        if (err) {
            callback(response("Het maken van de hoofdcategorie is mislukt.", {}));
        } else {
            callback(response("Het maken van de hoofdcategorie is gelukt.", hoofdCategorie));
        }
    });
}

exports.putHoofdCategorie = function (body, callback) {
    'use strict';
    var update;
    HoofdCategorie.find({_id : body.id}, function (err, hoofdCategorie) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de hoofdcategorie is mislukt.", {}));
        } else {
            if (hoofdCategorie[0]) {
                update = hoofdCategorie[0];
                update.naam = body.naam;
                update.icoon = body.icoon;
                update.save(function (err, hoofdCategorie) {
                    if (err) {
                        callback(response("Het updaten van de hoofdcategorie is mislukt.", {}));
                    } else {
                        callback(response("Het updaten van de hoofdcategorie is gelukt.", hoofdCategorie));
                    }
                });
            } else {
                callback(response("Kan de gevraagde hoofdcategorie niet vinden.", {}));
            }
        }
    });
}
