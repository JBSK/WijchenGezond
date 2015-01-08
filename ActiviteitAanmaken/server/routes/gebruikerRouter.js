// Deze functie controleerd of de docent wel ingelogd is, anders wordt hij ge-redirect.
function checkOpSessie (req, res, next) {
	if (req.session.userName) {
		next();
	} else {
		res.send({
			ingelogd : false
		});
	}
}