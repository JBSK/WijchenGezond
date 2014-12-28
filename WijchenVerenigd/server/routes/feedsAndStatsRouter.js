var fasControllers = require('../controllers/feedsAndStatsControllers.js');

module.exports = function (express) {
	var fasRouter = express.Router();
	fasRouter.get('/feeds', fasControllers.getFeeds);
	fasRouter.get('/stats', fasControllers.getFeeds);
	fasRouter.post('/feeds', fasControllers.react);

	return fasRouter;
}