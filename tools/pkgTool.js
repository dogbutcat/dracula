function isNpmPkg(pkgName, options) {
    let ret = true;
    if (/^\./.test(pkgName)) {
        ret = false;
    }
    return ret;
}

function installPkg(pkgs, opts) {
    (opts = opts || {}), (pkgs = Array.isArray(pkgs) ? pkgs : [pkgs]);
    let childProcess = require("child_process"),
        LogHelper = require("../tools/LogHelper"),
        executor = "npm",
        installArg = ["install", "--silent", "--no-progress", "-D"],
        output = null;

    installArg = installArg.concat(pkgs);
    LogHelper.log(`start installing packages: ${pkgs.join(', ')} ...`);
    output = childProcess.spawnSync(executor, installArg, {
        ...opts
    });

    return output.error ? false : true;
}
module.exports = {
    isNpmPkg,
    installPkg
};
