const os = require("os");
let babelrc = {
        presets: ["@babel/preset-react", "@babel/preset-env"],
        plugins: [
            "@babel/plugin-proposal-class-properties", // for static property transform
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-syntax-import-meta",
            "@babel/plugin-proposal-json-strings",
            [
                "import",
                {
                    libraryName: "antd",
                    style: true
                }
                // {
                //     libraryName: "antd-mobile",
                //     style: true
                // }
            ]
            // `style: true` 会加载 less 文件
        ]
        // env:
        //     process.env.NODE_ENV == "production"
        //         ? {}
        //         : {
        //               development: {
        //                   presets: ["react-hmre"]
        //               }
        //           }
    },
    cssLoader = createCssLoader();

function createCssLoader() {
    // 'css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]'
    return {
        loader: "css-loader",
        options: {
            modules: true,
            localIdentName: "[path][name]---[local]---[hash:base64:5]"
        }
    };
}

function createLessLoader(a, extract = false, postcssOpt) {
    let json = {},
        baseLoader = cssLoader,
        postcssOption = postcssOpt || {
            ident: "postcss", // webpack requires an identifier (ident) in options when {Function}/require is used (Complex Options). T
            plugins: [
                require("autoprefixer")({
                    browsers: ["ie>=8", ">1% in CN"]
                })
            ]
        },
        initLoaders = extract ? [] : ["style-loader"];
    if (a) {
        // if external theme file variable exist
        try {
            let fs = require("fs"),
                file = fs.readFileSync(a).toString(),
                fileS = file.split(os.EOL);
            for (var i = 0; i < fileS.length; i++) {
                if (
                    fileS[i].trim().indexOf("@") === 0 &&
                    fileS[i].trim().indexOf("@import") === -1
                ) {
                    // start with @ and not import description
                    let matches = fileS[i].match(/(^@.*):(.*);.*/);
                    if (matches) {
                        json[matches[1].trim()] = matches[2].trim();
                    }
                }
            }
            baseLoader = "css-loader";
        } catch (error) {}
    }

    return initLoaders.concat([
        baseLoader,
        { loader: "postcss-loader", options: postcssOption },
        {
            loader: "less-loader",
            options: {
                sourceMap: true,
                modifyVars: json,
                javascriptEnabled: true
            }
        }
    ]);
}

module.exports = {
    getlessStr: createLessLoader,
    // doc: https://www.npmjs.com/package/postcss-loader
    // return createLessLoader func for recursive call also can call {createLessLoader} directly
    loadPostcssOption: postcssOpt => {
        return function(modifyVarsFile, extract) {
            return createLessLoader(modifyVarsFile, extract, postcssOpt);
        };
    },
    /**
     * @param {{useBabelrc:Boolean, babelOption:BabelOption }} babelSetting
     */
    babel: babelSetting => {
        babelSetting = babelSetting || {};
        let val = babelSetting.babelOption || babelrc;
        let useBabelrc = babelSetting.useBabelrc || false;
        if (useBabelrc) {
            try {
                let fs = require("fs"),
                    path = require("path"),
                    ApiTool = require("../../api/ApiTool"),
                    file = fs
                        .readFileSync(
                            path.resolve(ApiTool.getProjectDir(), "./.babelrc")
                        )
                        .toString();
                val = JSON.parse(file);
            } catch (error) {}
        }
        return {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: val
            }
        };
    },
    css: () => {
        return {
            test: /\.css$/,
            // loader: 'style-loader!' + cssLoader
            use: ["style-loader", cssLoader]
        };
    },
    /**
     * path need to be absolute path
     */
    less: (regex, path) => {
        return {
            test: regex || /\.less$/,
            // loader: getlessStr(path)
            use: createLessLoader(path)
        };
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
    images: (size, emit) => {
        let val = size || 5120,
            emitFile = typeof emit == "boolean" ? emit : true;
        return {
            test: /\.(png|jpg|gif)$/,
            // loader: 'url-loader?limit=' + val + '&name=images/[hash:8].[name].[ext]&emitFile=' + emitFile
            use: [
                {
                    loader: "url-loader",
                    options: {
                        limit: val,
                        name: "images/[hash:8].[name].[ext]",
                        emitFile: emitFile
                    }
                }
            ]
        };
    }
};
