var path = require('path'),
    fs = require('fs'),
    ApiTool = require('../../../api/ApiTool');

function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.constants.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

let SetViewEngine = {
    hbs: (app, viewPath) => {
        let hbs, absViewPath = path.resolve(ApiTool.getProjectDir(), viewPath),
            absLayoutsDir = absViewPath;
        app.set('views', absViewPath);
        try {
            hbs = require('express-handlebars');
            if (fsExistsSync(absLayoutsDir + '/layouts')) {
                absLayoutsDir = absLayoutsDir + '/layouts';
            }
            app.engine('hbs', hbs({
                extname: '.hbs', defaultLayout: 'index',
                layoutsDir: absLayoutsDir, partialsDir: absViewPath + '/partials',
                helpers: {
                    section: function (name, block) {
                        if (!this._sections) this._sections = {};
                        this._sections[name] = block.fn(this);
                        return null;
                    },
                }
            }));
        } catch (e) {
            hbs = require('hbs');
        }
        app.set('view engine', 'hbs');
    }
};

module.exports = SetViewEngine;