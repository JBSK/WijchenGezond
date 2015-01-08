var mongoose = require('mongoose');
var SubCategorieSchema = mongoose.Schema({
    naam : {type : String, required : true},
    punten : {type : Number, required : true},
    hoofdCategorieId : {type : String, required : true}
}, {collection : "SubCategorieen"});

var SubCategorie = mongoose.model('SubCategorie', SubCategorieSchema);
var exports = module.exports = {};

var response = function (message, data) {
    return {
        message : message,
        data : data
    }
}

exports.getSubCategorie = function (_id, callback) {
    'use strict';
    SubCategorie.find({_id : _id}, function (err, SubCategorie) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de SubCategorie is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de SubCategorie is gelukt.", SubCategorie[0]));
        }
    });
}

exports.getSubCategorieen = function (hoofdCategorieId, callback) {
    'use strict';
    SubCategorie.find({hoofdCategorieId : hoofdCategorieId}, function (err, SubCategorieen) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de SubCategorieen is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de SubCategorieen is gelukt.", SubCategorieen));
        }
    });
}

exports.deleteSubCategorie = function (_id, callback) {
    'use strict';
    SubCategorie.remove({_id : _id}).exec(function (err) {
        if (err) {
            callback(response("Het verwijderen van de SubCategorie is mislukt.", {}));
        } else {
            callback(response("Het verwijderen van de SubCategorie is gelukt.", {}));
        }
    });
}

exports.deleteSubCategorieen = function (hoofdCategorieId, callback) {
    'use strict';
    SubCategorie.remove({hoofdCategorieId : hoofdCategorieId}).exec(function (err) {
        if (err) {
            callback(response("Het verwijderen van de SubCategorieen is mislukt.", {}));
        } else {
            callback(response("Het verwijderen van de SubCategorieen is gelukt.", {}));
        }
    });
}

exports.postSubCategorie = function (body, callback) {
    'use strict';
    var newCat = new SubCategorie();
    newCat.naam = body.naam;
    newCat.punten = body.punten;
    newCat.hoofdCategorieId = body.hoofdCategorieId;
    newCat.save(function (err, SubCategorie) {
        if (err) {
            callback(response("Het maken van de SubCategorie is mislukt.", {}));
        } else {
            callback(response("Het maken van de SubCategorie is gelukt.", SubCategorie));
        }
    });
}

exports.putSubCategorie = function (body, callback) {
    'use strict';
    var update;
    SubCategorie.find({_id : body._id}, function (err, SubCategorie) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de SubCategorie is mislukt.", {}));
        } else {
            if (SubCategorie[0]) {
                update = SubCategorie[0];
                update.naam = body.naam;
                update.punten = body.punten;
                update.hoofdCategorieId = body.hoofdCategorieId;
                update.save(function (err, SubCategorie) {
                    if (err) {
                        callback(response("Het updaten van de SubCategorie is mislukt.", {}));
                    } else {
                        callback(response("Het updaten van de SubCategorie is gelukt.", SubCategorie));
                    }
                });
            } else {
                callback(response("Kan de gevraagde SubCategorie niet vinden.", {}));
            }
        }
    });
}
