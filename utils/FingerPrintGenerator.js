var FingerPrintJs = require('fingerprintjs');
var Des = require('./Des.js');

// var floor = Math.floor.bind(Math);
// var pow = Math.pow.bind(Math);
// var random = Math.random.bind(Math);

// function createRandomStr() {
// 	return floor(pow(2, 31) * random()).toString(36);
// }

function split(txt) {
	var a = txt[0], b = txt[txt.length - 1], sliced = txt.slice(1, txt.length - 1),i, isOdd;
	isOdd = ((txt.charCodeAt(0) + txt.charCodeAt(txt.length - 1)) % 2); // 0 is even and 1 is odd
	for (i = 0; i < sliced.length; i++){
		if (i % 2 == isOdd) {
			a += sliced[i];
		} else {
			b += sliced[i];
		}
	}
	return [a, b];
}

function createFP(fp,a,b,c){
	var code = fp.get().toString(), encoded = Des.a(code, a, b, c);
	return split(encoded);
}

var FingerPrint = {
	// k1: createRandomStr(),
	// k2: createRandomStr(),
	getFP: function (a,b,c) {
		this.fp = this.fp || new FingerPrintJs({ canvas: true });
		this.arr = this.arr || createFP(this.fp, a, b, c);
		return this.arr;
	}
}

module.exports = FingerPrint;