var SC = require('./../models/mongooseSchemas').SC;
var exports = module.exports = {};

var response = function (message, data) {
    return {
        message : message,
        data : data
    }
}

exports.getSubCategorie = function (_id, callback) {
    'use strict';
    SC.find({_id : _id}, function (err, SubCategorie) {
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
    SC.find({hoofdCategorieId : hoofdCategorieId}, function (err, SubCategorieen) {
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
    SC.remove({_id : _id}).exec(function (err) {
        if (err) {
            callback(response("Het verwijderen van de SubCategorie is mislukt.", {}));
        } else {
            callback(response("Het verwijderen van de SubCategorie is gelukt.", {}));
        }
    });
}

exports.deleteSubCategorieen = function (hoofdCategorieId, callback) {
    'use strict';
    SC.remove({hoofdCategorieId : hoofdCategorieId}).exec(function (err) {
        if (err) {
            callback(response("Het verwijderen van de SubCategorieen is mislukt.", {}));
        } else {
            callback(response("Het verwijderen van de SubCategorieen is gelukt.", {}));
        }
    });
}

exports.postSubCategorie = function (body, callback) {
    'use strict';
    var newCat = new SC();
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
    SC.find({_id : body._id}, function (err, SubCategorie) {
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
