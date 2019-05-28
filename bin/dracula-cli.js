#!/usr/bin/env node
// run according to args to determin whether debug or release mode

let argvs = process.argv,
    LogHelper = require("../tools/LogHelper");

function ifArg(name, fn, init) {
    if (argvs.indexOf(name) != -1) {
        if (init) init();
        fn(true, -1);
    }
}

function logBasic(output) {
    let main = output.hash ? output : output.children[0];
    console.log("Hash: ", LogHelper.FgGreen(main.hash));
    console.log("Webpack version: ", LogHelper.FgGreen(main.version));
    console.log(
        "Elapsed Time: ",
        main.time > 10000
            ? LogHelper.FgYellow("" + main.time / 1000 + "s")
            : LogHelper.FgGreen("" + main.time + "ms")
    );
}

function printList(output) {
    let items = output.assets || output.children[0].assets;
    items.forEach(val => {
        console.log(
            "" + LogHelper.transferSize(val.size),
            "\t",
            LogHelper.FgGreen(val.name),
            "\t",
            val.chunks.join(""),
            "\t",
            val.chunkNames.join("")
        );
    });
}

function compilerFn(err, stats) {
    if (!err) {
        // console.log('file will output to: ', webpackConfig.output.path);
        let output = stats.toJson();
        output.warnings.length > 0 &&
            console.log(
                "Warnings: \n",
                LogHelper.FgYellow(output.warnings.join(""))
            );
        output.errors.length > 0 &&
            console.log("Error: ", LogHelper.FgRed(output.errors.join("")));
        logBasic(output);
        printList(output);
    } else {
        console.log(LogHelper.FgRed(err));
    }
}

function processOptions(opt) {
    let runOptions = {},
        webpack = null,
        ServerConfig = require("../api/ServerConfig"),
        serverConfig = new ServerConfig(),
        compiler = null,
        createApp = require("../network/server/app");
    ifArg("debug", function(bool) {
        runOptions.debug = bool;
        runOptions.release = !bool;
        process.env.NODE_ENV = process.env.NODE_ENV || "development";
    });
    ifArg("release", function(bool) {
        runOptions.release = bool;
        runOptions.debug = !bool;
        process.env.NODE_ENV = process.env.NODE_ENV || "production";
    });
    ifArg("server", function(bool) {
        runOptions.server = bool;
        process.env.NODE_ENV = process.env.NODE_ENV || "runtime";
    });
    LogHelper.setDEV(runOptions.debug);
    if (runOptions.debug) {
        webpack = require("../webpack/webpack");
        compiler = webpack("dev");
        if (runOptions.server) {
            // createApp(serverConfig.getServerConfig(), compiler);
            let debugSect = require('./devProcess');
            debugSect();
        } else {
            compiler.compiler.run(compilerFn);
        }
    } else if (runOptions.release) {
        webpack = require("../webpack/webpack");
        webpack("release", {
            packServer: serverConfig.getServerConfig().ssr || false
        }).compiler.run(compilerFn);
        if (runOptions.server) {
            createApp(serverConfig.getServerConfig());
        }
    } else {
        createApp(serverConfig.getServerConfig());
    }
}

processOptions(argvs);
