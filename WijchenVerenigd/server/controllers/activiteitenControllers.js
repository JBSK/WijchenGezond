var activiteit = require('../models/activiteit.js');

var exports = module.exports = {};

exports.createActiviteit = function (req, res) {
	activiteit.createActiviteit(req.body, function(data) {
		res.send(data);
	});
};

exports.getActiviteit = function (req, res) {
	activiteit.getActiviteit(req.params._id, function(data) {
		res.send(data);
	});
};

exports.getActiviteiten = function (req, res) {
	activiteit.getActiviteiten(function(data) {
		res.send(data);
	});
};

exports.voegDeelnemerToe = function (req, res) {
	activiteit.voegDeelnemerToe(req.body, function(data) {
		res.send(data);
	});
};

exports.verwijderDeelnemer = function (req, res) {
	activiteit.verwijderDeelnemer(req.body, function(data) {
		res.send(data);
	});
};

exports.filterActiviteiten = function (req, res) {
	activiteit.filterActiviteiten(function(data) {
		res.send(data);
	});
};