describe('Test Api Tool', () => {
	let ApiTool;
	beforeAll(() => {
		ApiTool = require('../ApiTool');
	})
	test('getlibRootTool should not empty', () => {
		let { getlibRootPath } = require('../ApiTool');
		expect(getlibRootPath()).toBeTruthy;
	})
	test('getlibRootTool should be absolute path', () => {
		expect(ApiTool.getlibRootPath()[0]).toBe('/');
	})
})