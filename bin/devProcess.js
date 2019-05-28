let childProcess = require("child_process");

let serverFork = null,
    fileWatcher = null;

function killProcess(pid) {
    let kill = childProcess.spawnSync("kill", ["-SIGTERM", pid]);
}

function stopProcess(e) {
    killProcess(serverFork.pid);
    fileWatcher && fileWatcher.close();
}

/**
 * Work in main thread
 */
function debugSect() {
    let path = require("path"),
        LogHelper = require("../tools/LogHelper"),
        { installPkg } = require("../tools/pkgTool"),
        IPCData = require("../model/ipcData"),
        ApiTool = require("../api/ApiTool"),
        CUSTOM_SIGNAL = require("../model/enums"),
        chokidar = require("chokidar");

    let devProcessFile = path.resolve(
        ApiTool.getlibRootPath(),
        "./network/server/app.js"
    );

    serverFork = childProcess.fork(devProcessFile);

    fileWatcher = chokidar.watch(ApiTool.getConfigFilePath());
    fileWatcher.on("ready", () => {
        fileWatcher.on("change", (path, stats) => {
            LogHelper.clear();
            LogHelper.log(LogHelper.FgYellow("config file has changed"));
            serverFork.send(
                new IPCData({ type: CUSTOM_SIGNAL.CONFIG_CHANGE }).toString()
            );
        });
    });

    //#region process signal
    process.on("SIGTERM", () => {
        LogHelper.log("System breaking down!");
        stopProcess();
    });
    process.on("SIGINT", () => {
        LogHelper.log("System going down!");
        stopProcess();
    });
    process.on("SIGTRAP", () => {
        LogHelper.log("System caught severe error!");
        stopProcess();
    });
    serverFork.on("message", data => {
        let ipcData = new IPCData(data),
            result;
        if (
            ipcData.type === CUSTOM_SIGNAL.INSTALL_PKG &&
            ipcData.data.length > 0
        ) {
            killProcess(serverFork.pid);
            LogHelper.clear();
            LogHelper.log(
                LogHelper.FgRed(
                    "Missing package(s): " + ipcData.data.join(", ")
                )
            );
            result = installPkg(ipcData.data);
            if (result) {
                LogHelper.log(LogHelper.FgGreen("install complete!"));
                LogHelper.log("restarting...");
                setTimeout(() => {
                    LogHelper.clear();
                    serverFork = childProcess.fork(devProcessFile);
                }, 1000);
            }
        }
    });
    //#endregion
}

module.exports = debugSect;
