let BaseRoute = require('./BaseRoute'),
	ApiController = require('../controllers/ApiController');

class ApiRoute extends BaseRoute{
	constructor(setting) {
		super(new ApiController(setting));
	}
	// list all route path here
	getRoute() {
		/**接口start====================================================================*/
		this._router.use('/*',this._apiController.mainEntry());
		return this._router;
	}
}

module.exports = ApiRoute;