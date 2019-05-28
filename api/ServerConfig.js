let externalConfig = require("./ExternalConfig"),
    { ServerModel } = require("../model/configModel"),
    localServerConfig = require("../config/server/setting");

class ServerConfig {
    constructor() {
        this._serverConfig = new ServerModel();
    }
    getServerConfig(path) {
        // check external exists and external config has server
        let serverConfig = externalConfig.getExternalConfig(path).server;
        return this.updateServerConfig(serverConfig);
    }
    updateServerConfig(serverConfig) {
        // return serverConfig
        //     ? new ServerModel(Object.assign(localServerConfig, serverConfig))
        //     : new ServerModel(localServerConfig);
        this._serverConfig.initData(
            serverConfig
                ? Object.assign(localServerConfig, serverConfig)
                : localServerConfig
        );
        return this._serverConfig;
    }
}

module.exports = ServerConfig;
