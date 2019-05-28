let ExternalConfig = jest.genMockFromModule('../ExternalConfig.js')
let draculaConfig = {};

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

function getExternalConfig(filename) {
	if (!filename || filename.indexOf('dracula.test.config.js') > -1) {
		return draculaConfig;
	} else {
		return {};
	}
}

ExternalConfig.getExternalConfig = getExternalConfig;

module.exports = ExternalConfig;