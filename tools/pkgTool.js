const path = require("path"),
    { getProjectDir } = require("../api/ApiTool");

function isNpmPkg(pkgName, options) {
    let ret = false,
        pkgInJson = false,
        searchPkg = pkgName, // used to search
        fullPkg; // used to return for install
    if (/^\./.test(searchPkg)) {
        // module name like './a.js' is not a npm package
        ret = false;
        return;
    }
    const pkgJson = require(path.resolve(getProjectDir(), "./package.json"));

    if ("devDependencies" in pkgJson) {
        let filteredPkgs = Object.keys(pkgJson.devDependencies).filter(
            pkg => searchPkg.indexOf(pkg) == 0
        );
        if (filteredPkgs.length > 0) {
            // found missing package in filtered package
            // use first one
            let pkgVersion = pkgJson.devDependencies[filteredPkgs[0]].replace(
                /[\^\~]/,
                ""
            );
            searchPkg = filteredPkgs[0];
            fullPkg = filteredPkgs[0] + "@" + pkgVersion;
            pkgInJson = true;
        }
    }

    if (!pkgInJson) {
        // not found package in package.json
        let splitedPkgNames = searchPkg.split("/");
        searchPkg = splitedPkgNames[0];
        if (searchPkg.indexOf("@") === 0) {
            // start with `@`, permit one more `/`
            searchPkg += "/" + splitedPkgNames[1];
        }
        fullPkg = searchPkg;
    }

    if (fetchRemotePkg(searchPkg)) {
        ret = fullPkg;
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
