// De controllers bevatten de functies voor de hoofdCategorieen.
var categorieControllers = require('../controllers/categorieControllers.js');

// De routes die worden gebruikt door docent ('/hoofdCategorieen').
module.exports = function (express) {
	var categorieenRouter = express.Router();
	categorieenRouter.get('/hoofdCategorieen', categorieControllers.getHoofdCategorieen);
	categorieenRouter.get('/hoofdCategorieen/:id', categorieControllers.getHoofdCategorie);
	categorieenRouter.post('/hoofdCategorieen', categorieControllers.postHoofdCategorie);
	categorieenRouter.delete('/hoofdCategorieen/:id', categorieControllers.deleteHoofdCategorie);
	categorieenRouter.get('/hoofdCategorieen/subCategorieen/:id', categorieControllers.getSubCategorieen);
	
	categorieenRouter.get('/subCategorieen/:id', categorieControllers.getSubCategorie);
	categorieenRouter.post('/subCategorieen', categorieControllers.postSubCategorie);
	categorieenRouter.delete('/subCategorieen/:id', categorieControllers.deleteSubCategorie);

	return categorieenRouter;
}