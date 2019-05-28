class ServerModel {
    // _serviceIp;
    // _port;
    // _ssr;
    // _acceptHeaders;
    // _browserSupport;
    // _blockPageName;
    // _assetPath;
    // _viewPath;
    constructor(obj) {
        this.initData(obj);
    }

    initData(obj) {
        if (obj) {
            this._DEV = obj.DEV;
            this._serviceIP = obj.serviceIP;
            this._port = obj.port;
            this._ssr = obj.ssr;
            this._restfulSupport = obj.restfulSupport;
            this._acceptHeaders = obj.acceptHeaders;
            this._browserSupport = obj.browserSupport;
            this._blockPageName = obj.blockPageName;
            this._assetPath = obj.assetPath;
            this._viewPath = obj.viewPath;
        }
    }

    get DEV(){
        return this._DEV;
    }

    get serviceIP() {
        return this._serviceIP;
    }

    get port() {
        return this._port;
    }

    get ssr() {
        return this._ssr;
    }

    get restfulSupport(){
        return this._restfulSupport;
    }

    get acceptHeaders() {
        return this._acceptHeaders;
    }

    get browserSupport() {
        return this._browserSupport;
    }

    get blockPageName() {
        return this._blockPageName;
    }

    get assetPath() {
        return this._assetPath;
    }

    get viewPath() {
        return this._viewPath;
    }
}

class WebpackModel {}

class ConfigModel {
    // /**
    //  * @type {ServerModel}
    //  */
    // _serverConfig;
    // /**
    //  * @type {WebpackModel}
    //  */
    // _webpackConfig;

    constructor(obj) {
        this.initData(obj);
    }

    initData(obj) {
        if (obj) {
            this._serverConfig = new ServerModel(obj.server);
        }
    }

    get server() {
        return this._serverConfig;
    }

    get webpack() {
        return this._webpackConfig;
    }
}

module.exports = { ConfigModel, ServerModel };
