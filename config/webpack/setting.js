let path = require("path"),
	fs = require("fs"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	{ getlibRootPath, getProjectDir } = require("../../api/ApiTool"),
	defaultLoader = require("./loader"),
	defaultPlugin = require("./plugins");

let extractDracula = new ExtractTextPlugin({
	filename: "dracula.css",
	allChunks: true
});
let extractSrc = new ExtractTextPlugin({
	filename: "outer.css",
	allChunks: true
});

let nodeModules = {};
fs
	.readdirSync(path.resolve(getProjectDir(), "node_modules"))
	.filter(function(x) {
		return [".bin"].indexOf(x) === -1;
	})
	.forEach(function(mod) {
		nodeModules[mod] = "commonjs " + mod;
	});

let extLess = fs.existsSync(path.resolve(getProjectDir(), "src/theme.less"));

module.exports = {
	useBundle: true,
	dev: {
		defineDracula: {
			"_CONCAT_API": JSON.stringify('/api'),
			"_NOENCRYPT":JSON.stringify(['/base-usercenter/']),
			"process.env.NODE_ENV":'"development"'
		},
		config: {
			name: "Development Version",
			entry: {
				main: [
					// necessary for hot reloading with IE:
					"eventsource-polyfill",
					// listen to code updates emitted by hot middleware:
					"webpack-hot-middleware/client",
					// your code:
					"./src/index.js"
				]
			},
			devtool: "eval",
			// devtool: 'cheap-module-source-map',
			plugins: [defaultPlugin.hotReplace(), defaultPlugin.noEmitError(),defaultPlugin.loaderOptionsPlugin()]
		}
	},
	release: {
		ieSupport: true,
		defineDracula: {
			"_CONCAT_API": JSON.stringify('/api'),
			"_NOENCRYPT":JSON.stringify(['/base-usercenter/']),
			"process.env.NODE_ENV":'"production"'
		},
		config: {
			name: "Release Version",
			entry: {
				main: [
					"console-polyfill",
					"babel-polyfill",
					"es5-shim",
					"es5-shim/es5-sham",
					// your code:
					"./src/index.js"
				]
			},
			devtool: false,
			plugins: [
				// defaultPlugin.cssSplitPlugin({ size: 4000, imports: true }), // remove for avoid external config exist
				defaultPlugin.noEmitError(),
				/* defaultPlugin.es3ifyPlugin(), // MUST put before uglify or it not work
				// defaultPlugin.uglify({
				// 	ie8: true,
				// 	output: {
				// 		comments: false,  // remove all comments
				// 	},
				// 	compress: {
				// 		warnings: false
				// 	}
				// }),
				defaultPlugin.uglify({
					uglifyOptions: {
						ie8: true,
						output: {
							comments: false,  // remove all comments
						},
						compress: true,
						warnings: false
					}
				}), */
				defaultPlugin.compressPlugin({
					//gzip 压缩
					asset: "[path].gz[query]",
					algorithm: "gzip",
					test: new RegExp(
						"\\.(js|css)$" //压缩 js 与 css
					),
					threshold: 10240,
					minRatio: 0.8
				}),
				defaultPlugin.loaderOptionsPlugin()
			]
		}
	},
	common: {
		output: {
			path: path.resolve(getlibRootPath(), "public/project"),
			filename: "spa.js",
			publicPath: "/project/"
		},
		module: {
			loaders: [defaultLoader.babel()]
		}
	},
	serverPack: {
		name: "Server Version",
		entry: {
			server: [
				// your code:
				// path.resolve(getlibRootPath(),'network/server/routes/index.js')
				path.resolve(getlibRootPath(), "network/server/routes/IndexRoute.js")
			]
		},
		output: {
			path: path.resolve(getProjectDir(), "build"),
			filename: "server.js",
			publicPath: "project/",
			libraryTarget: "commonjs2"
		},
		target: "node",
		externals: nodeModules,
		module: {
			loaders: [
				defaultLoader.babel({
					presets: ["react", ["es2015", { loose: true }], "stage-3"],
					plugins: [
						"transform-class-properties" // for static property transform
					]
				}),
				defaultLoader.css(),
				{
					test: /src(\\|\/).*less$/,
					loader: extractDracula.extract(defaultLoader.getlessStr(null, true))
				},
				extLess
					? {
							test: /!(src)(\\|\/).*less$/,
							loader: extractSrc.extract(
								defaultLoader.getlessStr(
									path.resolve(getProjectDir(), "src/theme.less"),
									true
								)
							)
						}
					: {},
				defaultLoader.images(5120, false)
			]
		},
		plugins: [
			extractDracula,
			extractSrc,
			defaultPlugin.cleanWebpackPlugin(["build"], {
				root: getProjectDir(), //一个根的绝对路径.
				verbose: true,
				dry: false,
				exclude: [] ////排除不删除的目录，主要用于避免删除公用的文件
			}),
			defaultPlugin.loaderOptionsPlugin()
		]
	}
};
