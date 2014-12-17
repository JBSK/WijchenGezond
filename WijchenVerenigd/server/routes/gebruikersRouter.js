var gebruikerControllers = require('../controllers/gebruikerControllers.js');

// Deze functie controleerd of de docent wel ingelogd is, anders wordt hij ge-redirect.
function checkOpSessie (req, res, next) {
	if (req.session.ingelogd) {
		next();
	} else {
		res.send({
			ingelogd : false
		});
	}
}

// De routes die worden gebruikt door de subcategorieën ('/subCategorieen').
module.exports = function (express) {
	var gebruikerRouter = express.Router();
	gebruikerRouter.get('/:_id', gebruikerControllers.getGebruiker);
	gebruikerRouter.get('/', gebruikerControllers.getGebruikers);
	gebruikerRouter.get('/getVrienden/:_id', gebruikerControllers.getVrienden);
	gebruikerRouter.post('/createGebruiker', gebruikerControllers.createGebruiker);
	gebruikerRouter.post('/addVriend', gebruikerControllers.addVriend);
	
	gebruikerRouter.post('/login', gebruikerControllers.login);
    gebruikerRouter.post('/logout', gebruikerControllers.logout);
	gebruikerRouter.delete('/delVriend', gebruikerControllers.delVriend);

	return gebruikerRouter;
}