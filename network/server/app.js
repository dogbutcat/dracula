let createApp = (serverConfig, webpack) => {
    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
        // var port = parseInt(val, 10);

        // if (isNaN(port)) {
        //     // named pipe
        //     return val;
        // }

        // if (port >= 0) {
        //     // port number
        //     return port;
        // }
        return (val && (parseInt(val, 10) > 0 && parseInt(val, 10))) || false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }

        var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind =
            typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        debug("Listening on " + bind);

        if (LogHelper.__isDEV) {
            let openAddr = `http://127.0.0.1:${addr.port}`;
            try {
                var open = require("open"),
                    app;

                switch (process.platform) {
                    case "wind32":
                        app = "chrome";
                        break;
                    case "linux":
                        app = "google-chrome";
                        break;
                    case "darwin":
                        app = "google chrome";
                        break;

                    default:
                        break;
                }
                open(openAddr, { app });
            } catch (error) {
                LogHelper.error(
                    "open browser failed! Please manually open: " + openAddr
                );
            }
        }
    }
    var myConfig = serverConfig;
    var express = require("express");
    var app = express();
    var path = require("path");
    var ApiTool = require("../../api/ApiTool");
    var LogHelper = require("../../tools/LogHelper");
    var MiddlewareBase = require("./middlewares/MiddlewareBase");
    var SetViewEngine = require("./middlewares/SetViewEngine");
    var ErrorHandler = require("./middlewares/ErrorHandler");
    var InjectStream = require("./middlewares/InjectStream");
    var routes = require("./routes/index");
    var debug = require("debug")("dracula:server");
    var http = require("http");
    var server = null,
        port = normalizePort(process.env.PORT || "" + myConfig.port);
    LogHelper.log(
        "静态服务已启动:" +
            (webpack ? "开发(虚拟spa.js chrome开发)" : "生产(IE8兼容/压缩包)") +
            "模式"
    );
    LogHelper.log(
        webpack
            ? "热更打包中:请等待webpack built 完成"
            : "静态服务已启动完毕 ^_^ 请打开 "
    );

    LogHelper.log("页面地址: http://localhost:" + port);
    if (webpack) {
        myConfig.ssr = false; // dev mode set ssr to false no matter what
        app.use(
            require("webpack-dev-middleware")(webpack.compiler, {
                noInfo: true,
                publicPath: webpack.config.output.publicPath
            })
        );

        app.use(require("webpack-hot-middleware")(webpack.compiler));
    }

    MiddlewareBase.configure(app, myConfig);
    SetViewEngine.hbs(app, myConfig.viewPath);

    app.use(
        express.static(
            path.resolve(ApiTool.getProjectDir(), myConfig.assetPath)
        )
    );

    // allow external route config to override inner one
    serverConfig.custom &&
        serverConfig.custom.serverRoutes &&
        serverConfig.custom.serverRoutes(app);

    //allow custom header and CORS
    // app.all('*', InjectStream('*'));

    var uploadPath = "/cloudfile/upload";
    app.use(uploadPath, InjectStream(uploadPath, myConfig)); // upload

    app.use("/", routes(myConfig));

    // catch 404 and forward to error handler
    app.use(ErrorHandler.get404Error);

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get("env") === "development") {
        app.use(ErrorHandler.getDevelopError);
    } else {
        // production error handler
        // no stacktraces leaked to user
        app.use(ErrorHandler.getProductionError);
    }

    /**
     * Create HTTP server.
     */
    server = http.createServer(app);
    server.on("error", onError);
    server.on("listening", onListening);
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    return server;
};

if (process.send) {
    /**
     * work in fork process
     */
    let configFilename = process.argv.slice(2)[0] || "dracula.config.js",
        ServerConfig = require("../../api/ServerConfig"),
        ApiTool = require("../../api/ApiTool"),
        LogHelper = require("../../tools/LogHelper"),
        webpack = require("../../webpack/webpack"),
        IPCData = require("../../model/ipcData"),
        CUSTOM_SIGNAL = require("../../model/enums");

    let serverConfigInstance = new ServerConfig(),
        serverConfig = serverConfigInstance.getServerConfig(configFilename),
        compiler = webpack("dev"),
        application = null;

    LogHelper.setDEV(serverConfig.DEV);
    process.on("message", data => {
        let ipcData = new IPCData(data);
        if (ipcData.type == CUSTOM_SIGNAL.CONFIG_CHANGE) {
            Object.keys(require.cache).forEach(val => {
                if (val.indexOf(configFilename) !== -1) {
                    delete require.cache[val];
                }
            });
            serverConfigInstance.updateServerConfig(
                require(ApiTool.getConfigFilePath()).server
            );
        }
    });

    function closeHandler() {
        // close express server
        application.close(() => {
            process.exit(0);
        });

        // express server close timeout
        setTimeout(() => {
            console.log("close server timeout");
            process.exit(1);
        }, 2000);
    }
    process.on("SIGTERM", closeHandler);
    application = createApp(serverConfig, compiler);
} else {
    module.exports = createApp;
}
