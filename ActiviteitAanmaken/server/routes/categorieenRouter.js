// De controllers bevatten de functies voor de hoofdCategorieen.
var categorieControllers = require('../controllers/categorieControllers.js');

// De routes die worden gebruikt door docent ('/hoofdCategorieen').
module.exports = function (express) {
	var categorieenRouter = express.Router();
	categorieenRouter.get('/hoofdCategorieen', categorieControllers.getHoofdCategorieen);
	categorieenRouter.get('/hoofdCategorieen/:_id', categorieControllers.getHoofdCategorie);
	categorieenRouter.post('/hoofdCategorieen', categorieControllers.postHoofdCategorie);
	categorieenRouter.delete('/hoofdCategorieen/:_id', categorieControllers.deleteHoofdCategorie);
	categorieenRouter.get('/hoofdCategorieen/subCategorieen/:_id', categorieControllers.getSubCategorieen);
	
	categorieenRouter.get('/subCategorieen/:_id', categorieControllers.getSubCategorie);
	categorieenRouter.post('/subCategorieen', categorieControllers.postSubCategorie);
	categorieenRouter.delete('/subCategorieen/:_id', categorieControllers.deleteSubCategorie);

	return categorieenRouter;
}