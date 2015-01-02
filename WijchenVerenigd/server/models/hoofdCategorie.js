var HC = require('./../models/mongooseSchemas').HC;
var exports = module.exports = {};

var response = function (message, data) {
    return {
        message : message,
        data : data
    }
}

exports.getHoofdCategorie = function (_id, callback) {
    'use strict';
    HC.find({_id : _id}, function (err, hoofdCategorie) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de hoofdcategorie is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de hoofdcategorie is gelukt.", hoofdCategorie[0]));
        }
    });
}

exports.getHoofdCategorieen = function (callback) {
    'use strict';
    HC.find(function (err, hoofdCategorieen) {
        if (err) {
            console.log(err);
            callback(response("het zoeken naar de hoofdcategorieen is mislukt.", {}));
        } else {
            callback(response("het zoeken naar de hoofdcategorieen is gelukt.", hoofdCategorieen));
        }
    });
}

exports.deleteHoofdCategorie = function (_id, callback) {
    'use strict';
    HC.remove({_id : _id}).exec(function (err) {
        if (err) {
            callback(response("Het verwijderen van de hoofdcategorie is mislukt.", {}));
        } else {
            callback(response("Het verwijderen van de hoofdcategorie is gelukt.", {}));
        }
    });
}

exports.postHoofdCategorie = function (body, callback) {
    'use strict';
    var newCat = new HC();
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
    HC.find({_id : body._id}, function (err, hoofdCategorie) {
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
