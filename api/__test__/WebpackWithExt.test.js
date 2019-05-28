jest.mock('../ExternalConfig.js');

describe('Test WebpackConfig api', () => {
	let WebpackConfig;
	beforeAll(() => {
		jest.mock('../../dracula.test.config.js');
		jest.unmock('webpack');
		WebpackConfig = require('../WebpackConfig');
	})
	beforeEach(() => {
		this.webpackConfig = new WebpackConfig('dracula.test.config.js')
	})
	afterAll(() => {
		jest.unmock('../../dracula.test.config.js');
	})
	test('get default path without useBundle option', () => {
		expect(this.webpackConfig.getWebpackPath()).toEqual('webpack');
	})
	test('with useAnalyzer property dev plugins length should be 4', () => {
		this.webpackConfig.externalConfig.webpack.dev.useAnalyzer = true;
		expect(this.webpackConfig.getWebpackConfig()['plugins']).toHaveLength(4);
	})
	test('get path with useBundle option', () => {
		this.webpackConfig.externalConfig.webpack.useBundle = false;
		expect(this.webpackConfig.getWebpackPath()).toContain('node_modules');
	})
	test('if mode param not exist use dev', () => {
		expect(this.webpackConfig.getWebpackConfig()['entry']).not.toHaveProperty('main');
	})
})
