let WebpackConfig = require("../api/WebpackConfig");

function webpack(mode, options, webpackHandler) {
    let webpackConfig = new WebpackConfig(),
        webpackPath = webpackConfig.getWebpackPath(),
        webpack = require(webpackPath),
        ProgressPlugin = require(webpackPath + "/lib/ProgressPlugin"),
        compileConfig = webpackConfig.getWebpackConfig(mode, options),
        compiler = webpack(compileConfig, webpackHandler);
    compiler.apply(
        new ProgressPlugin({
            // profile: argv.profile
        })
    );
    if (process.send) {
        let PkgInstallPlugin = require("../webpack/pkgInstallPlugin");
        compiler.apply(new PkgInstallPlugin());
    }
    return { compiler, config: compileConfig };
}

exports = module.exports = webpack;
