let path = require('path'),
    draculaConfig = jest.genMockFromModule('../dracula.test.config.js');

draculaConfig.server = {
    port: 8080
}
draculaConfig.webpack = {
    dev: {
        config: {
            entry: './react_page/index.js',
        }
    }
}
module.exports = draculaConfig;