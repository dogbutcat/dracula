// jest.mock('../Des.js');

let Fp;
beforeEach(() => {
	Fp = require('../FingerPrintGenerator.js');
})

describe('FingerPrint TestCase', () => {
	test('should work with des Properly', () => {
		expect(Fp.getFP('a')).toMatchSnapshot();
	})
	test('should not change for different import', () => {
		expect(Fp.getFP('a')).toMatchSnapshot();
	})
})