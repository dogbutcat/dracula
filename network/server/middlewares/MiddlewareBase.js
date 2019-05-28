var compression = require('compression'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser');

let MiddlewareBase = {
    configure: (app, config) => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false, limit: '100kb'}));
        config.DEV && app.use(logger( 'combined'));
        app.use(compression());
        app.use(cookieParser());
    }
}

module.exports = MiddlewareBase;
