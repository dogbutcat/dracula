let path = require('path'),
	fs = require('fs'),
	BaseController = require('./BaseRoute'),
	multipart = require('connect-multiparty'),
	ApiTool = require('../../../api/ApiTool'),
	UploadController = require('../controllers/UploadController');

class UploadRoute extends BaseController{
	constructor(setting) {
		super(new UploadController(setting));
		this._setting = setting;
	}
	mkdirsSync(dirname) {
		if (fs.existsSync(dirname)) {
			return true;
		} else {
			if (this.mkdirsSync(path.dirname(dirname))) {
				fs.mkdirSync(dirname);
				return true;
			}
		}
	}
	getRoute() {
		let fileTmpPath = path.resolve(ApiTool.getProjectDir(), this._setting.assetPath, 'filetmp');
		this.mkdirsSync(fileTmpPath);
		const multipartMiddleware = multipart({ uploadDir: fileTmpPath, keepExtensions: true });
		this._router.post('/*', multipartMiddleware, this._apiController.mainEntry());
		return this._router;
	}
}

module.exports = UploadRoute;