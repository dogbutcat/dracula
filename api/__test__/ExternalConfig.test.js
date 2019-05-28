jest.autoMockOff();
jest.mock('fs');
jest.mock('../../dracula.test.config.js');

let externalConfig
beforeEach(() => {
	externalConfig = require('../ExternalConfig');
})
afterEach(() => {
	externalConfig = null;
})

describe('externalConfig Test', () => {
	test('default externalConfig is Falsy', () => {
		expect(externalConfig.externalConfig).toBeFalsy();
	})
	test('getExternalConfig without filename should return falsy', () => {
		expect(externalConfig.getExternalConfig()).toMatchSnapshot();
	})
	test('get none exist file should have empty object', () => {
		expect(externalConfig.getExternalConfig('none.js')).toMatchSnapshot();
	})
	test('get external config should have property', () => {
		// console.log(externalConfig.getExternalConfig('dracula.test.config.js'));
		expect(externalConfig.getExternalConfig('dracula.test.config.js')).toHaveProperty('server');
	})
	test('get external config without search file if got file', () => {
		let ApiTool = require('../ApiTool.js');
		const getlibRootSpy = jest.spyOn(ApiTool, 'getlibRootPath');
		let ret = externalConfig.getExternalConfig('dracula.test.config.js');
		expect(getlibRootSpy).not.toHaveBeenCalled();
		getlibRootSpy.mockReset();
		getlibRootSpy.mockRestore();
	})
})