function PkgInstallPlugin(options) {}

PkgInstallPlugin.prototype.apply = function(compiler) {
    let { isNpmPkg } = require("../tools/pkgTool"),
        IPCData = require("../model/ipcData"),
        CUSTOM_SIGNAL = require("../model/enums");
    compiler.plugin("done", function(stats) {
        let compileError = stats.compilation.errors,
            hasCompileError = compileError.length > 0;
        if (hasCompileError) {
            compileError.forEach(errItem => {
                if (errItem.name === "ModuleNotFoundError") {
                    let errDependencies = errItem.dependencies,
                        missingPkgList = [];
                    errDependencies.forEach(errDep => {
                        if (isNpmPkg(errDep.request)) {
                            missingPkgList.push(errDep.request);
                        }
                    });

                    if (missingPkgList.length > 0) {
                        setTimeout(function() {
                            process.send(
                                new IPCData({
                                    type: CUSTOM_SIGNAL.INSTALL_PKG,
                                    data: [...new Set(missingPkgList)] // filter out same value
                                }).toString()
                            );
                        }, 1000); // setTimeout for output latency
                    }
                }
            });
        }
    });
};

module.exports = PkgInstallPlugin;
