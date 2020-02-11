/**
 * * dynamic import deps has problem
 * {@link https://github.com/webpack/webpack/issues/8656#issuecomment-496822882}
 */
let _isDev = process.env.NODE_ENV == "development";
// if development mode is false, other is true
let _isSSR = !!(process.env.NODE_ENV == "development" ^ true) & false;
module.exports = {
    server: {
        DEV: _isDev,
        serviceIP: "http://",
        port: 3000, //port
        ssr: _isSSR,
        title: "This is Template Title",
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

        var defaultPlugin = require("dracula/config/webpack/plugins");
        var defaultLoader = require("dracula/config/webpack/loader");
        var defaultMix = require("dracula/config/webpack/mix");
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
                defaultLoader.babel({ useBabelrc:true }),
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
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    },
                    __SSR: JSON.stringify(_isSSR)
            })
            : defaultPlugin.definePlugin({
                    __SSR: JSON.stringify(_isSSR)
            });

        var resolve = {
            alias: {
                "@proj": path.resolve(__dirname, 'src'),
                '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/icons.js'),
                'react-dom': '@hot-loader/react-dom'
            }
        };

        return {
            dev: {
                useAnalyzer: false,
                config: {
                    entry: {
                        main: [
                            // for react hot reload
                            "react-hot-loader/patch"
                        ]
                    },
                    devtool: "cheap-module-eval-source-map",
                    output: {
                        path: path.resolve(__dirname, "./public/project"),
                        filename: "spa.dev.js",
                        publicPath: "/project/"
                    },
                    resolve,
                    module: configModuleDebug,
                    plugins: [...commonPlugins, releaseDefine]
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
                    resolve,
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
                        releaseDefine,
                        defaultPlugin.es3ifyPlugin(), // MUST put before uglify or it not work
                        defaultPlugin.compressPlugin(),
                        defaultPlugin.manifestJsonPlugin()
                    ],
                    ...defaultPlugin.optimization({
                        splitChunks: {
                            cacheGroups: {
                                vendor: {
                                    test: /[\\/]node_modules[\\/]/,
                                    name: 'vendor',
                                    chunks: 'all',
                                },
                                // moment: {
                                //     test(module, chunks){
                                //         const path = require('path');
                                //         return module.resource && (module.resource.includes(`${path.sep}node_modules/moment${path.sep}`)) || false;
                                //     },
                                //     name: 'moment',
                                //     chunks: 'all',
                                // },
                                // styles: {
                                //     name: 'styles',
                                //     test: /\.css$/,
                                //     chunks: 'all',
                                //     enforce: true,
                                //     // priority: 20, 
                                // }
                            }
                        }
                    })
                },
                serverPack:{
                    resolve
                }
            },
            useBundle: false
        };
    }
};
