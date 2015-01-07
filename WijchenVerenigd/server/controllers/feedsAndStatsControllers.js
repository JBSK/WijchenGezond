var fas = require('../models/feedsAndStats.js');

var exports = module.exports = {};

exports.getFeeds = function (req, res) {
	fas.getFeeds(function (data) {
		res.send(data);
	});
};

exports.getFeedsGebruikerVrienden = function (req, res) {
	fas.getFeedsGebruikerVrienden(req.params._id, function (data) {
		res.send(data);
	});
};

exports.getFeedsGebruiker = function (req, res) {
	fas.getFeedsGebruiker(req.params._id, function (data) {
		res.send(data);
	});
};

exports.react = function (req, res) {
	fas.react(req.body, function (data) {
		res.send(data);
	});
}