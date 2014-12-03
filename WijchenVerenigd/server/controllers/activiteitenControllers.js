var activiteit = require('../models/activiteit.js');

var exports = module.exports = {};

exports.postActiviteit = function (req, res) {
	vraag.postActiviteit(req.body, function(data) {
		res.send(data);
	});
};

exports.putActiviteit = function (req, res) {
	vraag.putActiviteit(req.body, function(data) {
		res.send(data);
	});
};

exports.getActiviteiten = function (req, res) {
	vraag.getActiviteiten(function(data) {
		res.send(data);
	});
};

exports.getActiviteit = function (req, res) {
	vraag.getActiviteit(req.params.id, function(data) {
		res.send(data);
	});
};

exports.deleteActiviteit = function (req, res) {
	vraag.deleteActiviteit(req.params.id, function(data) {
		res.send(data);
	});
};