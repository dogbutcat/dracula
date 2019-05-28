let fs = require("fs"),
    path = require("path"),
    ApiTool = require("../api/ApiTool");

let ExternalConfig = {
    getExternalConfig(filename) {
        if (this.externalConfig) {
            return this.externalConfig;
        }
        filename = filename || "dracula.config.js";
        let delimiter = process.platform == "win32" ? "\\" : "/",
            searchDirArr = ApiTool.getlibRootPath().split(delimiter);
        // check external file exists until path ends;
        while (searchDirArr.length > 0) {
            let fileConfig = delimiter + filename,
                filePath = searchDirArr.join(delimiter) + fileConfig;
            if (fs.existsSync(filePath)) {
                console.log(
                    "\x1b[32m%s\x1b[0m",
                    "Found Config file under directory: " +
                        searchDirArr.join(delimiter)
                );
                this.externalConfig = require(filePath);
                ApiTool.setProjectDir(searchDirArr.join(delimiter));
                ApiTool.setConfigFilePath(filePath);
                break;
            }
            searchDirArr = searchDirArr.slice(0, -1);
        }
        if (!this.externalConfig) {
            // TODO: commander REPL
            console.log(
                "\x1b[31m%s\x1b[0m",
                "Can not Find dracula.config.js, WILL USE DEFAULT!"
            );
            // throw new Error('Can not Find dracula.config.js');
        }
        return this.externalConfig || {};
    }
};

module.exports = ExternalConfig;
