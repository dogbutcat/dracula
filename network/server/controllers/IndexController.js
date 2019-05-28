let path = require('path'),{ getProjectDir } = require('../../../api/ApiTool'), Main = null,
	BaseController = require('./BaseController');

// this is to pack up react-router
try {
	var merge = require('lodash/merge'), React = require('react'),
	{ renderToString } = require('react-dom/server'),
	{ match, RouterContext } = require('react-router');
	Main = require('../../../../src/routes.js');
} catch (error) {
	Main = {};
}


class IndexController extends BaseController {
	constructor(setting) {
		super(setting);
	}

	serverRender(req, res, next) {
		try {
			match({ routes: Main, location: req.originalUrl }, (error, redirectLocation, renderProps) => {
				if (error) {
					res.status(500).render('error');
				} else if (redirectLocation) {
					res.redirect(302, redirectLocation.pathname + redirectLocation.search);
				} else if (renderProps) {
					let components = renderProps.components,
						target = components[components.length - 1],
						reqUrl = req.originalUrl.split('?')[0], reqParam = null,
						targetUrl = req.protocol + "://" + req.headers['host'];
					
					try {
						reqParam = JSON.parse(req.query.data);
					} catch (e) {
					}
					let requestInitialData = target.requestInitialData && target.requestInitialData(targetUrl, reqParam || null);
					if (!requestInitialData) {
						requestInitialData = Promise.all(requestInitialData);
					}
					requestInitialData.then(function (data) {
						this.createLog('Success!!!!!');
						var renderMain = merge({}, renderProps, { params: { __initData__: data.data } });
						var body = renderToString(React.createElement(RouterContext, renderMain));
						res.status(200).render('index', { body: body });
					}).catch((e) => {
						this.createLog('Error!!!!!');
						var renderMain = merge({}, renderProps, { params: { __initData__: {} } });
						var body = renderToString(React.createElement(RouterContext, renderMain));
						res.status(200).render('index', { body: body });
					});
				} else {
					next();
				}
			});
		} catch (error) {
			next(error);
		}
	}

	renderPage(req, res, next) {
		let {ssr, DEV} = this.Setting;
		if (ssr) {
			this.serverRender(req, res, next);
		} else {
			res.render('index', { isSSR: true, isDEV: DEV });
		}
	}

	mainEntry() {
		return (req, res, next) => {
			let userAgent = req.headers['user-agent'],
				browserSupport = this.Setting.browserSupport || 0,
				blockPageName = path.resolve(getProjectDir(), this.Setting.assetPath, this.Setting.blockPageName || 'index.html'),
				ieReg = null;
			if (!userAgent) {
				res.send('Oh! Where Are You From? Σ(￣。￣ﾉ)ﾉ')
			} else if (browserSupport) {
				if (('' + browserSupport).match(/[5-9]|1[01]/)) {
					ieReg = userAgent.match(/msie\s(\d+)\./i);
					ieReg && ieReg[1] < browserSupport ?
						res.sendFile(blockPageName) : this.renderPage(req, res, next);
				} else {
					this.renderPage(req, res, next);
				}
			} else {
				this.renderPage(req, res, next);
			}
		};
	}
}

module.exports = IndexController