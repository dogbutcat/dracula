let express = require('express');

class BaseRoute { 
	constructor(props) {
		this._router = express.Router();
		this._apiController = props;
	}
}

module.exports = BaseRoute;