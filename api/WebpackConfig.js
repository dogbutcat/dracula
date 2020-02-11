let ExternalConfig = require('./ExternalConfig'),
	path = require('path'),
	_ = require('lodash')
	ApiTool = require('../api/ApiTool'),
	defaultPlugin = require('../config/webpack/plugins'),
	localWebpackConfig = require('../config/webpack/setting');

class WebpackConfig {
	constructor(filename) {
		this.defaultOptions = { packServer: false };
		this.externalConfig = ExternalConfig.getExternalConfig(filename);
	}

	mergeCustomizer(target, source) {
		if (_.isArray(target)) {
			return target.concat(source);
		}
	}

	initOptions(opts) {
		let newOpts = null;
		if (opts) {
			newOpts = _.mergeWith({}, this.defaultOptions, opts, this.mergeCustomizer);
		}
		return newOpts || this.defaultOptions;
	}

	checkExternal(webpackObj) {
		let ret = null;
		if (typeof webpackObj == 'object') {
			ret = webpackObj;
		} else if(typeof webpackObj == 'function') {
			ret = webpackObj();
		} else {
			ret = {};
		}
		return ret;
	}

	mergeConfigs(mode,localConfig,configMode) {
		return _.mergeWith(_.merge(localConfig[mode].config, localConfig.common), configMode, this.mergeCustomizer);
	}

	getWebpackConfig(mode = 'dev', options) {
		let opts = this.initOptions(options);
		let webpackObj = this.externalConfig.webpack,
			externalWebpack = this.checkExternal(webpackObj),
			externConfig = externalWebpack[mode],
			localConfig = localWebpackConfig,
			configMode = externConfig && externConfig['config'] || {};
		this.outConfig = this.mergeConfigs(mode,localConfig, configMode);
		if(externalWebpack && externConfig){
			if(externConfig['useAnalyzer']){
				this.outConfig.plugins.push(defaultPlugin.analyzerPlugin({
					analyzerMode: 'server',
					// Host that will be used in `server` mode to start HTTP server.
					analyzerHost: '127.0.0.1',
					// Automatically open report in default browser
					openAnalyzer: false,
					// Port that will be used in `server` mode to start HTTP server.
					analyzerPort: 8888
				}));
			}
			if (externConfig['defineDracula']) {
				this.outConfig.plugins.push(defaultPlugin.definePlugin(_.merge(localConfig[mode]['defineDracula'], externConfig['defineDracula'])));
			} else {
				this.outConfig.plugins.push(defaultPlugin.definePlugin(localConfig[mode]['defineDracula']));
			}
		}
		return opts.packServer 
				? [this.outConfig, _.mergeWith(localWebpackConfig.serverPack,externConfig.serverPack, this.mergeCustomizer)] 
				: this.outConfig;
	}

	getWebpackPath() {
		let externalWebpack = this.externalConfig.webpack,
			useBundle = externalWebpack && 'useBundle' in externalWebpack ?
				externalWebpack.useBundle : true;
		return typeof useBundle == 'boolean' && !useBundle &&
			(path.resolve(ApiTool.getProjectDir(), './node_modules/webpack')) || 'webpack';
	}
}

module.exports = WebpackConfig;