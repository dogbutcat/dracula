const loader = require("./loader"),
    LogHelper = require("../../tools/LogHelper");

function initExtractOption(option) {
    option = option || {};
    let styleOption = option.styleOption || {},
        extractOption = option.extractOption || {},
        reg = option.reg || /\.less$/;

    let filename = extractOption.filename,
        chunkFilename = extractOption.chunkFilename,
        extractOpt = extractOption.options;

    let postCss = styleOption.postCss || {};
    let less = styleOption.less || {};
    if (!filename) {
        LogHelper.log(
            LogHelper.FgYellow("not given `filename`, use default `style.css`")
        );
        filename = "style.css";
    }
    if (!chunkFilename) {
        LogHelper.log(
            LogHelper.FgYellow(
                "not given `chunkFilename`, use default `style.[id].css`"
            )
        );
        chunkFilename = "style.[id].css";
    }
    return {
        reg,
        styleOption: {
            postCss,
            less
        },
        extractOption: {
            filename,
            chunkFilename,
            options: extractOpt
        }
    };
}

/**
 * create extract css instance
 * @param {{styleOption:Object,extractOption:Object,reg:Regexp}} orignal - setting
 * @returns {[LoaderInstance, PluginInstance]} - extract css instance
 */
function extractcss(orignal) {
    let option = initExtractOption(orignal);
    let { styleOption, extractOption, reg } = option;
    let ExtractTextPlugin = require("mini-css-extract-plugin"),
        extractCssPlugin = new ExtractTextPlugin({
            filename: extractOption.filename,
            chunkFilename: extractOption.chunkFilename
        });

    let customPostcssOpt = loader.loadPostcssOption(styleOption.postcss);

    return [
        {
            test: reg,
            use: [
                {
                    loader: ExtractTextPlugin.loader,
                    options: extractOption.options
                },
                ...customPostcssOpt(styleOption.less.extFile, true)
            ]
        },
        extractCssPlugin
    ];
}

module.exports = {
    extractcss
}