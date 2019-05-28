let path = require("path"),
    fs = require("fs"),
    { getlibRootPath, getProjectDir } = require("../../api/ApiTool"),
    defaultLoader = require("./loader"),
    defaultMix = require("./mix"),
    defaultPlugin = require("./plugins");

let nodeModules = {};
fs.readdirSync(path.resolve(getProjectDir(), "node_modules"))
    .filter(function(x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = "commonjs " + mod;
    });

let extFile =
    fs.existsSync(path.resolve(getProjectDir(), "src/theme.less")) &&
    path.resolve(getProjectDir(), "src/theme.less");

let extractDracula = defaultMix.extractcss({
    reg: /!(src)(\\|\/).*less$/,
    styleOption: {
        less: {
            extFile: extFile
        }
    },
    extractOption: {
        filename: "dracula.css",
        chunkFilename: "dracula-[id].css"
    }
});
let extractStyle = defaultMix.extractcss({
    reg: /src(\\|\/).*less$/,
    extractOption: {
        filename: "style.css",
        chunkFilename: "style-[id].css"
    }
});

module.exports = {
    useBundle: true,
    dev: {
        defineDracula: {
            _CONCAT_API: JSON.stringify("/api"),
            _NOENCRYPT: JSON.stringify(["/base-usercenter/"]),
            "process.env.NODE_ENV": '"development"'
        },
        config: {
            name: "Development Version",
            mode: "development",
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
            plugins: [
                defaultPlugin.hotReplace(),
                defaultPlugin.loaderOptionsPlugin()
            ],
            ...defaultPlugin.optimization()
        }
    },
    release: {
        ieSupport: true,
        defineDracula: {
            _CONCAT_API: JSON.stringify("/api"),
            _NOENCRYPT: JSON.stringify(["/base-usercenter/"]),
            "process.env.NODE_ENV": '"production"'
        },
        config: {
            name: "Release Version",
            mode: "production",
            entry: {
                main: [
                    "console-polyfill",
                    "@babel/polyfill",
                    "es5-shim",
                    "es5-shim/es5-sham",
                    // your code:
                    "./src/index.js"
                ]
            },
            devtool: false,
            plugins: [
                defaultPlugin.compressPlugin({
                    //gzip 压缩
                    asset: "[path].gz[query]",
                    algorithm: "gzip",
                    test: new RegExp(
                        "\\.(js|css)$" //压缩 js 与 css
                    ),
                    threshold: 10240,
                    minRatio: 0.8
                })
            ],
            ...defaultPlugin.optimization()
        }
    },
    common: {
        output: {
            path: path.resolve(getlibRootPath(), "public/project"),
            filename: "spa.js",
            publicPath: "/project/"
        },
        module: {
            rules: [defaultLoader.babel()]
        }
    },
    serverPack: {
        name: "Server Version",
        entry: {
            server: [
                // your code:
                // path.resolve(getlibRootPath(),'network/server/routes/index.js')
                path.resolve(
                    getlibRootPath(),
                    "network/server/routes/IndexRoute.js"
                )
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
        devtool: 'cheap-module-source-map',
        module: {
            rules: [
                defaultLoader.babel({
                    presets: ["@babel/preset-react", "@babel/preset-env"],
                    plugins: [
                        "@babel/plugin-proposal-class-properties" // for static property transform
                    ]
                }),
                defaultLoader.css(),
                extractStyle[0],
                extractDracula[0],
                defaultLoader.images(5120, false)
            ]
        },
        plugins: [
            defaultPlugin.cleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ["**/*"], //一个根的绝对路径.
                verbose: true,
                dry: true
            }),
            extractDracula[1],
            extractStyle[1],
            defaultPlugin.loaderOptionsPlugin()
        ]
    }
};
