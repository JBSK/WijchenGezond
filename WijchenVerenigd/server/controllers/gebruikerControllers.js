var gebruiker = require('../models/gebruiker.js');

var exports = module.exports = {};

exports.getGebruikers = function (req, res) {
	gebruiker.getGebruikers(function(data) {
		res.send(data);
	});
};

exports.getGebruiker = function (req, res) {
	gebruiker.getGebruiker(req.params._id, function(data) {
		res.send(data);
	});
};

exports.createGebruiker = function (req, res) {
	if (req.body._id) {
		gebruiker.updateGebruiker(req.body, function(data) {
			res.send(data);
		});
	} else {
		gebruiker.createGebruiker(req.body, function(data) {
			res.send(data);
		});
	}
};

exports.addVriend = function (req, res) {
	gebruiker.addVriend(req.body, function(data) {
		res.send(data);
	});
};

exports.delVriend = function (req, res) {
	gebruiker.delVriend(req.body, function(data) {
		res.send(data);
	});
};

exports.getVrienden = function (req, res) {
	gebruiker.getVrienden(req.params._id, function(data) {
		res.send(data);
	});
};

exports.isIngelogd = function(req, res) {
	if (req.session.ingelogd) {
		res.send({
			message : "Je bent ingelogd.",
			success : true,
			data : req.session
		});
	} else {
		res.send({
			message : "Je bent niet ingelogd.",
			success : false,
			data : false
		});
	}
}

exports.login = function (req, res) {
	if (req.session.ingelogd) {
		res.send({
			message : "Je bent al ingelogd.",
			data : req.session
		});
	} else {
		gebruiker.login(req.body, function(data) {
			console.log(data);
			if (data.data.succes) {
				req.session.ingelogd = true;
				req.session._id = data.data._id;
				req.session.username = data.data.username;
				req.session.avatar = data.data.avatar;
				res.send({
					message : data.message,
					success : true,
					data : {
						_id : req.session._id,
						username : req.session.username
					}
				});
			} else {
				res.send({
					message : data.message,
					success : false,
					data : {}
				});
			}
		});
	};
};

exports.logout = function (req, res) {
    "use strict";
	if (req.session.ingelogd) {
		req.session.ingelogd = false;
	}
	res.send({
		message : "Je bent uitgelogd.",
		data : {}
	});
};