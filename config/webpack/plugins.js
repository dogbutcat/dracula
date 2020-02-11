const webpack = require("webpack"),
    LogHelper = require("../../tools/LogHelper"),
    _ = require("lodash"),
    ManifestJsonPlugin = require('../../webpack/manifestPlugin');

function _deprecatedWarning(olds, news) {
    LogHelper.log(
        LogHelper.FgRed(
            `${olds} is deprecated in Webpack 4, use \`optimization({${news}})\` instead.`
        )
    );
}

function _unstableWarning(api) {
    LogHelper.log(LogHelper.FgYellow(`${api} is experimental API.`));
}

const uglify = (a, _warning) => {
    !_warning && _deprecatedWarning("uglify", "minimizer");
    let UglifyJSPlugin = require("uglifyjs-webpack-plugin");
    let val = a || {
        uglifyOptions: {
            ie8: true,
            output: {
                comments: false // remove all comments
            },
            compress: true,
            warnings: false
        }
    };
    return new UglifyJSPlugin(val);
};

const pluginList = {
    // dev
    hotReplace: () => new webpack.HotModuleReplacementPlugin(),
    noEmitError: () => {
        _deprecatedWarning("noEmitError", "noEmitOnErrors");
        // webpack.NoEmitOnErrorsPlugin ? new webpack.NoEmitOnErrorsPlugin() : new webpack.NoErrorsPlugin()
    },

    //release
    definePlugin: a => {
        let val =
            a ||
            _.merge(
                { "process.env": { NODE_ENV: JSON.stringify("production") } },
                a
            );
        return new webpack.DefinePlugin(val);
    },
    // doc: https://www.npmjs.com/package/uglifyjs-webpack-plugin
    uglify: uglify,
    // doc: https://www.npmjs.com/package/compression-webpack-plugin
    compressPlugin: a => {
        let CompressionWebpackPlugin = require("compression-webpack-plugin");
        let val = a || {
            //gzip 压缩
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
                "\\.(js|css)$" //压缩 js 与 css
            ),
            threshold: 10240,
            minRatio: 0.8
        };
        return new CompressionWebpackPlugin(val);
    },
    // doc: https://www.npmjs.com/package/compression-webpack-plugin
    analyzerPlugin: a => {
        let BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
            .BundleAnalyzerPlugin;
        return new BundleAnalyzerPlugin(a);
    },
    // doc: https://www.npmjs.com/package/es3ify-webpack-plugin
    es3ifyPlugin: () => {
        _unstableWarning("es3ifyPlugin");
        let Es3ifyPlugin = require("es3ify-webpack-plugin");
        return new Es3ifyPlugin();
    },
    // doc: https://www.npmjs.com/package/clean-webpack-plugin
    cleanWebpackPlugin: (a) => {
        let CleanWebpackPlugin = require("clean-webpack-plugin");
        return new CleanWebpackPlugin(a);
    },
    // doc: https://www.npmjs.com/package/css-split-webpack-plugin
    cssSplitPlugin: a => {
        let CssSplitPlugin = require("css-split-webpack-plugin").default;
        let val = a || { size: 4000, imports: true };
        return new CssSplitPlugin(val);
    },
    loaderOptionsPlugin: extOpt => {
        // let postcss_opt = {
        //     postcss: function() {
        //         return [
        //             require("autoprefixer")({
        //                 browsers: ["ie>=8", ">1% in CN"]
        //             })
        //         ];
        //     }
        // };
        let default_opt = {};
        let options = _.merge(
            {},
            default_opt,
            // { options: postcss_opt },
            extOpt || {}
        );
        return new webpack.LoaderOptionsPlugin(options);
    },

    ignorePlugin: webpackOpt => {
        return new webpack.IgnorePlugin(webpackOpt);
    },

    // mainly for server still need one chunk
    limitChunkCountPlugin: webpackOpt => {
        return new webpack.optimize.LimitChunkCountPlugin(webpackOpt);
    },

    manifestJsonPlugin: webpackOpt => {
        return new ManifestJsonPlugin(webpackOpt);
    },

    // webpack 4
    optimization: webpackOpts => {
        webpackOpts = webpackOpts || {};
        let optimization = _.merge(
            {
                noEmitOnErrors: true,
                minimizer: [uglify(null, true)]
            },
            webpackOpts
        );
        return { optimization };
    }
};

module.exports = pluginList;
