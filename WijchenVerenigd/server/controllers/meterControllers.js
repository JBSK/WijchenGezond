var meter = require('../models/meter.js');

var exports = module.exports = {};

exports.getMeter = function (req, res) {
	meter.getMeter(function(data) {
		res.send(data);
	});
};

exports.addPunten = function (req, res) {
	meter.addPunten(req.body, function(data) {
		res.send(data);
	});
};