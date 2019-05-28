let BaseRoute = require('./BaseRoute'),
	IndexController = require('../controllers/IndexController');

class IndexRoute extends BaseRoute {
	constructor(setting) {
		super(new IndexController(setting));
	}
	// list all route path here
	getRoute() {
		/**接口start====================================================================*/
		this._router.get('/:ip?', this._apiController.mainEntry());
		return this._router;
	}
}

module.exports = IndexRoute;