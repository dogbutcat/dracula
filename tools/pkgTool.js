function isNpmPkg(pkgName, options) {
    let ret = false;
    // if (/^\./.test(pkgName)) {
    //     ret = false;
    // }
    if (fetchRemotePkg(pkgName)) {
        ret = true;
    }
    return ret;
}

function fetchRemotePkg(pkgName, opts) {
    let childProcess = require("child_process"),
        LogHelper = require("../tools/LogHelper"),
        executor = "npm",
        cmdArgs = ["search", "--json"].concat(pkgName),
        output = null,
        searchJson,
        result = false;
    LogHelper.log(LogHelper.FgYellow("searching for package: " + pkgName));
    output = childProcess.spawnSync(executor, cmdArgs, {
        timeout: 5000, // millisecons
        ...opts
    });
    try {
        searchJson = JSON.parse(output.stdout.toString()); // parse search result, fallback to []
    } catch (err) {
        searchJson = [];
    }
    for (let i = 0; i < searchJson.length; i++) {
        const pkg = searchJson[i];
        if (pkg.name === pkgName) {
            result = true;
            break;
        }
    }
    return result;
}

function installPkg(pkgs, opts) {
    (opts = opts || {}), (pkgs = Array.isArray(pkgs) ? pkgs : [pkgs]);
    let childProcess = require("child_process"),
        LogHelper = require("../tools/LogHelper"),
        executor = "npm",
        installArg = ["install", "--silent", "--no-progress", "-D"],
        output = null;

    installArg = installArg.concat(pkgs);
    LogHelper.log(`start installing packages: ${pkgs.join(", ")} ...`);
    output = childProcess.spawnSync(executor, installArg, {
        ...opts
    });

    return output.error ? false : true;
}
module.exports = {
    isNpmPkg,
    installPkg
};
