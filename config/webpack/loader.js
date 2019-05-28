let os = require('os');
let babelrc = {
	"presets": [
		"react",
		["es2015", { loose: true }],
		"stage-3"
	],
	"plugins": [
		"transform-class-properties", // for static property transform
		[
			"import",
			{
				"libraryName": "antd",
				"style": true
			},
			{
				"libraryName": "antd-mobile",
				"style": true
			}
		]
		// `style: true` 会加载 less 文件
	],
	"env": process.env.NODE_ENV == "production" ? {} : {
		"development": {
			"presets": [
				"react-hmre"
			]
		}
	}
},
	cssLoader = 'css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]';


function getlessStr(a, extract = false) {
  let json = {}, themeV = "",loaderStr = cssLoader;
  if (a) { // if external theme file variable exist
    try {
		let fs = require("fs"),
		file = fs.readFileSync(a).toString(),
		fileS = file.split(os.EOL);
		for (var i = 0; i < fileS.length; i++) {
			if (fileS[i].trim().indexOf("@") === 0 && fileS[i].trim().indexOf("@import") === -1) { // start with @ and not import description
				let matches = fileS[i].match(/(^@.*):(.*);.*/);
				if (matches) {
					json[matches[1].trim()] = matches[2].trim();
				}
			}
		}
		loaderStr = 'css-loader'
    } catch (error) {
    }
  }
  themeV = JSON.stringify({ sourceMap: true, modifyVars: json });

	return `${extract ? '' : 'style-loader!'}${loaderStr}!postcss-loader!less-loader?${themeV}`;
}

module.exports = {
	getlessStr: getlessStr,
	babel: (babelSetting) => {
		let val = babelSetting || babelrc;
		return {
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader?' + JSON.stringify(val).trim()
		}
	},
	css: () => {
		return {
			test: /\.css$/,
			loader: 'style-loader!' + cssLoader
		}
	},
	/**
	 * path need to be absolute path
	 */
	less: (regex, path) => {
		return {
			test: regex || /\.less$/,
			loader: getlessStr(path)
		}
	},
	// extractcss: (a,b) => {
	// 	let re = RegExp(a + '(\\|\/).*less$'),
	// 		ExtractTextPlugin = require('extract-text-webpack-plugin');
	// 	return {
	// 		test: re,
	// 		loader: ExtractTextPlugin.extract(`${cssLoader}!less-loader`)
	// 	}
	// },
	/**
	 * size: limit size, default 5120
	 * emit: emit file, default true
	 */
	images: (size,emit) => {
		let val = size || 5120,
			emitFile = typeof emit == "boolean" ? emit : true;
		return {
			test: /\.(png|jpg|gif)$/,
			loader: 'url-loader?limit=' + val + '&name=images/[hash:8].[name].[ext]&emitFile=' + emitFile
		}
	},
}