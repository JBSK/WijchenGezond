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
	gebruikerRouter.get('/gebruikers/:_id', gebruikerControllers.getGebruiker);
	gebruikerRouter.get('/gebruikers', gebruikerControllers.getGebruikers);
	gebruikerRouter.get('/getVrienden/:_id', gebruikerControllers.getVrienden);
	gebruikerRouter.post('/gebruikers', gebruikerControllers.createGebruiker);
	gebruikerRouter.post('/addVriend', gebruikerControllers.addVriend);
	
	gebruikerRouter.post('/login', gebruikerControllers.login);
    gebruikerRouter.post('/logout', gebruikerControllers.logout);
	gebruikerRouter.delete('/delVriend', gebruikerControllers.delVriend);
	//gebruikerRouter.get('/hoofdCategorieen/:_id', gebruikerControllers.getHoofdCategorie);
	//gebruikerRouter.post('/hoofdCategorieen', gebruikerControllers.postHoofdCategorie);
	//gebruikerRouter.delete('/hoofdCategorieen/:_id', gebruikerControllers.deleteHoofdCategorie);
	//gebruikerRouter.get('/hoofdCategorieen/subCategorieen/:_id', gebruikerControllers.getSubCategorieen);

	return gebruikerRouter;
}