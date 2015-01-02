var fasControllers = require('../controllers/feedsAndStatsControllers.js');

module.exports = function (express) {
	var fasRouter = express.Router();
	fasRouter.get('/feeds', fasControllers.getFeeds);
	fasRouter.get('/feeds/:_id', fasControllers.getFeedsGebruikerVrienden);
	fasRouter.get('/feeds/gebruiker/:_id', fasControllers.getFeedsGebruiker);
	fasRouter.get('/stats', fasControllers.getFeeds);
	fasRouter.post('/feeds', fasControllers.react);

	return fasRouter;
}