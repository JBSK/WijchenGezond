var fas = require('../models/feedsAndStats.js');

var exports = module.exports = {};

exports.getFeeds = function (req, res) {
	fas.getFeeds(function (data) {
		res.send(data);
	});
};

exports.react = function (req, res) {
	fas.react(req.body, function (data) {
		res.send(data);
	});
}