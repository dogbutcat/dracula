jest.mock('../ExternalConfig.js');

describe('Test WebpackConfig without external config', () => {
	let WebpackConfig;
	beforeAll(() => {
		jest.mock('webpack');
		WebpackConfig = require('../WebpackConfig');
	})
	test('if external config not exists', () => {
		let webpackConfig = new WebpackConfig('dracula.js');
		expect(webpackConfig.getWebpackConfig()['entry']).toHaveProperty('main');
	})
})