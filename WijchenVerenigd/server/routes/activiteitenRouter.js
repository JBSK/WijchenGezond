// De controllers bevatten de functies voor de docent.
var activiteitenControllers = require('../controllers/activiteitenControllers.js');

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

// Deze functie wordt gebruikt door Angular. Ook het front-end controleerd of de docent ingelogd is.
function sessie (req, res) {
	if (req.session.userName) {
		res.send({
			ingelogd : true
		});
	} else {
		res.send({
			ingelogd : false
		});
	}
}

// De routes die worden gebruikt door docent ('/docent').
module.exports = function (express) {
	var activiteitenRouter = express.Router();
	activiteitenRouter.get('/', activiteitenControllers.getActiviteiten);
	activiteitenRouter.get('/:_id', activiteitenControllers.getActiviteit);
	activiteitenRouter.post('/', activiteitenControllers.createActiviteit);
	//activiteitenRouter.delete('/', activiteitenControllers.verwijderActiviteit);

	activiteitenRouter.post('/addDeelnemer', activiteitenControllers.voegDeelnemerToe);
	activiteitenRouter.delete('/verwijderDeelnemer', activiteitenControllers.verwijderDeelnemer);

	return activiteitenRouter;
}