var meterControllers = require('../controllers/meterControllers.js');

function checkOpSessie (req, res, next) {
	if (req.session.ingelogd) {
		next();
	} else {
		res.send({
			ingelogd : false
		});
	}
}

module.exports = function (express) {
	var meterRouter = express.Router();
	meterRouter.get('/', meterControllers.getMeter);
	meterRouter.post('/', meterControllers.addPunten);

	return meterRouter;
};