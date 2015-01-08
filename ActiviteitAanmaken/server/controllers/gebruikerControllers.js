var activiteit = require('../models/gebruiker.js');

var exports = module.exports = {};

exports.checkSessie = function (req, res) {
	if(req.session) {
		res.send({
			ingelogd : true,
			message : "Je bent ingelogd!",
			data : req.session
		});
	} else {
		res.send({
			ingelogd : false,
			message : "Je bent niet ingelogd!"
		});
	}
};

exports.login = function (req, res) {
	if(req.body.wachtwoord === wachtwoord) {
  		req.session.userName = req.body.naam;
		res.send({
			ingelogd : true,
			message : "Welkom!"
		});
	} else {
		res.send({
			ingelogd : false,
			message : "Het gegeven wachtwoord is onjuist of de gegeven username is leeg."
		});
	}
};

exports.logout = function (req, res) {
	if(req.session.userName) {
  		req.session.destroy();
		res.redirect("/#/docent");
	} else {
		res.redirect("/#/docent");
	}
};