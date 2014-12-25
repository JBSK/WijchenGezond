var gebruikerControllers = require('../controllers/gebruikerControllers.js');

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
	var gebruikerRouter = express.Router();
	gebruikerRouter.get('/gebruiker/:_id', gebruikerControllers.getGebruiker);
	gebruikerRouter.get('/', gebruikerControllers.getGebruikers);
	gebruikerRouter.post('/', gebruikerControllers.createGebruiker);
	gebruikerRouter.get('/getVrienden/:_id', gebruikerControllers.getVrienden);
	gebruikerRouter.post('/addVriend/', gebruikerControllers.addVriend);
	
	gebruikerRouter.get('/login/', gebruikerControllers.isIngelogd);
	gebruikerRouter.post('/login/', gebruikerControllers.login);
    gebruikerRouter.post('/logout/', gebruikerControllers.logout);
	gebruikerRouter.delete('/delVriend/', gebruikerControllers.delVriend);

	return gebruikerRouter;
};