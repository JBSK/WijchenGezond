// De controllers bevatten de functies voor de docent.
var activiteitenControllers = require('../controllers/activiteitenControllers.js');

function checkOpSessie (req, res, next) {
	if (req.session.userName) {
		next();
	} else {
		res.send({
			ingelogd : false
		});
	}
}

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