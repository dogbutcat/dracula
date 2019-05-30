/**
 * * dynamic import deps has problem
 * {@link https://github.com/webpack/webpack/issues/8656#issuecomment-496822882}
 */
let _isDev = process.env.NODE_ENV == "development";
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
    webpack: function() {
        var path = require("path");
        var childProcess = require("child_process");
        const HtmlWebpackPlugin = require("html-webpack-plugin");

        var defaultPlugin = require("./lib/config/webpack/plugins");
        var defaultLoader = require("./lib/config/webpack/loader");
        var defaultMix = require("./lib/config/webpack/mix");
        var extThemePath = path.resolve(__dirname, "./src/theme.less");

        let extractDracula = defaultMix.extractcss({
            reg: /^(?!.*?(\\|\/)src(\\|\/)).*less$/,
            styleOption: {
                less: {
                    extFile: extThemePath
                }
            },
            extractOption: {
                filename: "dracula.css",
                chunkFilename: "dracula-[id].css"
            }
        });
        let extractStyle = defaultMix.extractcss({
            reg: /(.*?(\\|\/)src(\\|\/)).*less$/,
            extractOption: {
                filename: "src.css",
                chunkFilename: "src-[id].css"
            }
        });

        var configModuleDebug = {
            rules: [
                defaultLoader.babel(),
                defaultLoader.css(),
                defaultLoader.less(
                    /^(?!.*?(\\|\/)src(\\|\/)).*less$/,
                    extThemePath
                ),
                defaultLoader.less(/(.*?(\\|\/)src(\\|\/)).*less$/),
                defaultLoader.images()
            ]
        };
        var configModule = {
            rules: [
                defaultLoader.babel(),
                defaultLoader.css(),
                extractDracula[0],
                extractStyle[0],
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
                //uncomment below to add rev tag
                // builtInfo: `\n\tbuild on Date: ${(new Date()).toUTCString()} \n\tgit rev: ${childProcess.execSync("git rev-parse --short HEAD").toString()}`
            })
        ];

        var releaseDefine =
            process.env.NODE_ENV != "production"
                ? defaultPlugin.definePlugin({
                      "process.env": {
                          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
                      }
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
                    plugins: [...commonPlugins]
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
                        defaultPlugin.cleanWebpackPlugin({
                            cleanOnceBeforeBuildPatterns: [
                                "**/*",
                                path.resolve(__dirname, "./views")
                            ], //一个根的绝对路径.
                            verbose: true
                        }),
                        extractDracula[1],
                        extractStyle[1],
                        defaultPlugin.cssSplitPlugin({
                            size: 4000,
                            imports: false
                        }),
                        releaseDefine,
                        defaultPlugin.es3ifyPlugin(), // MUST put before uglify or it not work
                        defaultPlugin.compressPlugin()
                    ]
                }
            },
            useBundle: false
        };
    }
};
