let webpack = require('webpack'),
	_ = require('lodash');

const pluginList = {
	// dev
	hotReplace: () => new webpack.HotModuleReplacementPlugin(),
	noEmitError: () => webpack.NoEmitOnErrorsPlugin ? new webpack.NoEmitOnErrorsPlugin() : new webpack.NoErrorsPlugin(),

	//release
	// noError: () => new webpack.NoErrorsPlugin(),
	definePlugin: (a) => {
		let val = a || _.merge({ "process.env": { NODE_ENV: JSON.stringify("production") } }, a);
		return new webpack.DefinePlugin(val)
	},
	// uglify: (a) => new webpack.optimize.UglifyJsPlugin(a),
	uglify: (a) => {
		let UglifyJSPlugin = require('uglifyjs-webpack-plugin');
		let val = a || {
			uglifyOptions: {
				ie8: true,
				output: {
					comments: false,  // remove all comments
				},
				compress: true,
				warnings: false
			}
		};
		return new UglifyJSPlugin(val);
	},
	compressPlugin: (a) => {
		let CompressionWebpackPlugin = require('compression-webpack-plugin');
		let val = a || { //gzip 压缩
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(js|css)$'    //压缩 js 与 css
			),
			threshold: 10240,
			minRatio: 0.8
		};
		return new CompressionWebpackPlugin(val);
	},
	analyzerPlugin: (a) => {
		let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
		return new BundleAnalyzerPlugin(a);
	},
	es3ifyPlugin: () => {
		let Es3ifyPlugin = require('es3ify-webpack-plugin');
		return new Es3ifyPlugin();
	},
	cleanWebpackPlugin: (a,b) => {
		let CleanWebpackPlugin = require('clean-webpack-plugin');
		return new CleanWebpackPlugin(a, b);
	},
	cssSplitPlugin: (a) => {
		let CssSplitPlugin = require('css-split-webpack-plugin').default;
		let val = a || { size: 4000, imports: true };
		return new CssSplitPlugin(val);
	},
	loaderOptionsPlugin:(extOpt)=>{
		let postcss_opt = {
			postcss: function(){
				return [
					require("autoprefixer")({
						browsers: ['ie>=8','>1% in CN']
					})
				]
			}
		};
		let default_opt = {};
		let options = _.merge({}, default_opt, { options: postcss_opt }, extOpt || {});
		return new webpack.LoaderOptionsPlugin(options);
	}
};

module.exports = pluginList;