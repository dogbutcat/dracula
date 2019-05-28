let _isDev = process.env.NODE_ENV == 'development';
module.exports = {
    server: {
        DEV: _isDev,
        serviceIP: "http://",
        port: 3000, //port
        ssr: false,
        acceptHeaders: [
            "user-agent",
            "origin",
            "cookie",
            "referer",
            "os",
            "Authorization"
        ],
        browserSupport: 9,
        blockPageName: "hintPage.html",
        assetPath: "./public",
        viewPath: _isDev ? "./view" : "./views"
    },
    webpack: function () {
        var path = require("path");
        var childProcess = require("child_process");
        const HtmlWebpackPlugin = require("html-webpack-plugin");
        const ExtractTextPlugin = require("extract-text-webpack-plugin");
        var extractApin = new ExtractTextPlugin({
            filename: "apin.css",
            allChunks: true
        });
        var extractSrc = new ExtractTextPlugin({
            filename: "src.css",
            allChunks: true
        });
        var defaultPlugin = require("./lib/config/webpack/plugins");
        var defaultLoader = require("./lib/config/webpack/loader");
        var extThemePath = path.resolve(__dirname, "./src/theme.less");

        var configModuleDebug = {
            loaders: [
                defaultLoader.babel(),
                defaultLoader.css(),
                defaultLoader.less(/^(?!.*?(\\|\/)src(\\|\/)).*less$/, extThemePath),
                defaultLoader.less(/(.*?(\\|\/)src(\\|\/)).*less$/),
                defaultLoader.images()
            ]
        };
        var configModule = {
            loaders: [
                defaultLoader.babel(),
                defaultLoader.css(),
                {
                    test: /^(?!.*?(\\|\/)src(\\|\/)).*less$/,
                    loader: extractApin.extract(
                        defaultLoader.getlessStr(extThemePath, true)
                    )
                },
                {
                    test: /(.*?(\\|\/)src(\\|\/)).*less$/,
                    loader: extractSrc.extract(defaultLoader.getlessStr(null, true))
                },
                defaultLoader.images()
            ]
        };

        var commonPlugins = [
			new HtmlWebpackPlugin({
				filename: "../../views/error.hbs",
				template: "view/error.hbs",
				inject: false
			}),
			new HtmlWebpackPlugin({
				filename: "../../views/index.hbs",
				template: "view/index.hbs",
				inject: false,
                hash: true,
                builtInfo: `\n\tbuild on Date: ${(new Date()).toUTCString()} \n\tgit rev: ${childProcess.execSync("git rev-parse --short HEAD").toString()}`
			}),
		];

        var releaseDefine =
            process.env.NODE_ENV != "production"
                ? defaultPlugin.definePlugin({
                    "process.env": {NODE_ENV: JSON.stringify(process.env.NODE_ENV)}
                })
                : defaultPlugin.definePlugin();

        return {
            dev: {
                useAnalyzer: false,
                config: {
                    devtool: "cheap-module-eval-source-map",
                    output: {
                        path: path.resolve(__dirname, "./public/project"),
                        filename: "spa.dev.js",
                        publicPath: "/project/"
                    },
                    module: configModuleDebug,
                    plugins: [
                        ...commonPlugins
                    ]
                }
            },
            release: {
                useAnalyzer: false,
                config: {
                    output: {
                        path: path.resolve(__dirname, "./public/project"),
                        filename: "spa.js",
                        sourceMapFilename: "[file].map",
                        //加这个！
                        chunkFilename: "[name].[chunkhash:5].chunk.js",
                        publicPath: "/project/"
                    },
                    module: configModule,
                    plugins: [
                        ...commonPlugins,
                        //删除上次打包结果
                        defaultPlugin.cleanWebpackPlugin(["public/project","views"], {
                            root: path.join(__dirname), //一个根的绝对路径.
                            verbose: true,
                            dry: false,
                            exclude: ["src"] ////排除不删除的目录，主要用于避免删除公用的文件
                        }),
                        extractApin,
                        extractSrc,
                        defaultPlugin.cssSplitPlugin({size: 4000, imports: false}),
                        defaultPlugin.noEmitError(),
                        releaseDefine,
                        defaultPlugin.es3ifyPlugin(), // MUST put before uglify or it not work
                        defaultPlugin.uglify(),
                        defaultPlugin.compressPlugin()
                    ]
                }
            },
            useBundle: false
        };
    }
};
