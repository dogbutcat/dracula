//mock
jest.mock("axios");
jest.mock("../Safe.js");

if (typeof window !== 'undefined') {
	window._NOENCRYPT = [], window._CONCAT_API='';
}

//preset
let defaultReqOpt;
beforeEach(() => {
	jest.mock("../CookieHelp.js");
	defaultReqOpt = { safe: true, contentType: "application/json;charset=utf-8" };
});
afterEach(() => {
	jest.unmock("../CookieHelp.js");
	defaultReqOpt = { safe: true, contentType: "application/json;charset=utf-8" };
});

//test suit
describe("HttpTool TestSuit", () => {
	let httpTool, url;
	beforeAll(() => {
		httpTool = require("../HttpTool");
		url = "/base";
	});
	afterAll(() => {});
	// request type support
	it("request should have post type", () => {
		expect(httpTool).toHaveProperty("post");
	});
	it("request should have get type", () => {
		expect(httpTool).toHaveProperty("get");
	});
	it("request should have put type", () => {
		expect(httpTool).toHaveProperty("put");
	});
	it("request should have delete type", () => {
		expect(httpTool).toHaveProperty("delete");
	});

	//region os
	it("should init function with os preset work properly", () => {
		httpTool.init({ os: "web_0.1.0" });
		expect(httpTool.getRequestHeader(defaultReqOpt)).toHaveProperty(
			"os",
			"web_0.1.0"
		);
		httpTool.clearOS();
	});
	it("have property os", () => {
		expect(httpTool.getRequestHeader(defaultReqOpt)).toHaveProperty("os");
	});
	//endregion

	//region init function
	it("should init function with cookie preset with no target cookie", () => {
		httpTool.init({ authCookieName: "_uac" });
		expect(httpTool.getRequestHeader(defaultReqOpt)).not.toHaveProperty(
			"authHeader"
		);
		httpTool.clearAuthHeader("_uac");
	});
	it("should init function with cookie preset work with default cookie not exist", () => {
		httpTool.init({ authCookieName: "_at" });
		expect(httpTool.getRequestHeader(defaultReqOpt)).not.toHaveProperty(
			"authHeader"
		);
		httpTool.clearAuthHeader();
	});
	it("should init function with safe preset work properly", () => {
		httpTool.init({ safeKey: "private_key" });
		let key = "123";
		let ret = httpTool.formatBody(key);
		expect(ret).toMatchSnapshot();
		httpTool.clearEncrypt();
	});
	it("log workds", () => {
		log("works???");
		log("Yes! It works!!");
	});
	//endregion

	//region setter & getter
	it("should init function with cookie preset work with default cookie saved", () => {
		httpTool.setAuthHeader({ authCookieName: "_at" });
		expect(httpTool.getRequestHeader(defaultReqOpt)).toHaveProperty(
			"authCookieName"
		);
		httpTool.clearAuthHeader();
	});

	it("can change property os through set function", () => {
		let osStr = "web_1.0.0";
		httpTool.setOS(osStr);
		expect(httpTool.getRequestHeader(defaultReqOpt)).toHaveProperty(
			"os",
			osStr
		);
	});
	it("can reset property os through clear function", () => {
		let osStr = "web_1.0.0";
		httpTool.setOS(osStr);
		expect(httpTool.getRequestHeader(defaultReqOpt)).toHaveProperty(
			"os",
			osStr
		);
		httpTool.clearOS();
		expect(httpTool.getRequestHeader(defaultReqOpt)).toMatchSnapshot();
	});
	it("can set and clear special code event", () => {
		httpTool.setSpecialCodeEvent(code => {
			if (code === 200) {
				console.log("Job done");
			} else {
				return true;
			}
		});
		httpTool.clearSpecialCodeEvent();
	});
	//endregion

	//region changeEncryptOpt
	it("if url match the no encryption set flag to false", () => {
		let encryptArr = ["/base"],
			ret;
		ret = httpTool.changeEncryptOpt(url, defaultReqOpt, encryptArr);
		expect(ret).toHaveProperty("safe", false);
	});
	it("the no encryption array should be case-sensitive", () => {
		let encryptArr = ["/Base"],
			ret;
		ret = httpTool.changeEncryptOpt(url, defaultReqOpt, encryptArr);
		expect(ret).toHaveProperty("safe", true);
	});
	it("the no encryption array should be match exactly", () => {
		let encryptArr = ["/base/"],
			ret;
		ret = httpTool.changeEncryptOpt(url, defaultReqOpt, encryptArr);
		expect(ret).toHaveProperty("safe", true);
	});
	it("option should be false once matched the address", () => {
		let encryptArr = ["/base/", "/base", "/base-"],
			ret;
		ret = httpTool.changeEncryptOpt(url, defaultReqOpt, encryptArr);
		expect(ret).toHaveProperty("safe", false);
	});
	it("target no encryption array not effect subaddress", () => {
		let tempUrl = "/api/base",
			encryptArr = ["/base/", "/base", "/base-"],
			ret;
		ret = httpTool.changeEncryptOpt(tempUrl, defaultReqOpt, encryptArr);
		expect(ret).toHaveProperty("safe", true);
	});
	//endregion

	//region clearParam
	it("clear param function drop navigator and callback property", () => {
		let param = {
				navigator: {},
				callBack: () => {}
			},
			ret = httpTool.clearParam(param);
		expect(param).not.toHaveProperty("navigator");
		expect(param).not.toHaveProperty("callBack");
	});
	//endregion

	//region isArray
	it("isArray function with array", () => {
		expect(httpTool.isArray([])).toBeTruthy();
	});
	it("isArray function with string", () => {
		expect(httpTool.isArray("")).toBeFalsy();
	});
	it("isArray function with object", () => {
		expect(httpTool.isArray({})).toBeFalsy();
	});
	it("isArray function with null", () => {
		expect(httpTool.isArray(null)).toBeFalsy();
	});
	it("isArray function with number", () => {
		expect(httpTool.isArray(1)).toBeFalsy();
	});
	it("isArray function with undefined", () => {
		expect(httpTool.isArray(undefined)).toBeFalsy();
	});
	//endregion

	//region formatParamsTools
	it("formatParamsTools output string connect with &", () => {
		let ret = httpTool.formatParamsTools({ a: 1, b: 2 });
		expect(ret).toMatchSnapshot();
	});
	it("formatParamsTools output string connect with &", () => {
		let ret = httpTool.formatParamsTools({ a: 1, b: [1, 2, 3] });
		expect(ret).toMatchSnapshot();
	});
	it("formatParamsTools output string connect with &", () => {
		let ret = httpTool.formatParamsTools({
			a: { aa: ["1", 2, "tobe"] },
			b: [1, 2, 3]
		});
		expect(ret).toMatchSnapshot();
	});
	it("formatParamsTools output string skip undefined property", () => {
		let ret = httpTool.formatParamsTools({
			a: { aa: ["1", 2, "tobe"] },
			b: [1, 2, 3],
			c: undefined
		});
		expect(ret).not.toContain("c=");
	});
	it("formatParamsTools output string work with null", () => {
		let ret = httpTool.formatParamsTools({
			a: { aa: ["1", 2, "tobe"] },
			b: [1, 2, 3],
			c: null
		});
		expect(ret).toContain("c=null");
	});
	//endregion

	//region request Test
	//region callback switch
	it("should success with status equal 20x and code over 0", function() {
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post(
				url,
				val => {
					mockFn();
					resolve(val);
				},
				reject
			);
		});
		ret.then(val => expect(mockFn).toHaveBeenCalled()).catch();
	});
	it("should fail with status equal 200 but code not over 0", function() {
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post("/success-failure", resolve, () => {
				mockFn();
				reject();
			});
		});
		ret.then().catch(val => expect(mockFn).toHaveBeenCalled());
	});
    it('should fail when request url is empty', function () {
        let mockFn = jest.fn(), emptyUrl;
        let ret = new Promise((resolve, reject) => {
            httpTool.post(emptyUrl, resolve, () => {
                mockFn();
                reject();
            });
        });
        ret.then().catch(val => expect(mockFn).toHaveBeenCalled());
    });
    //endregion

	//region success callback
	it("should not execute any function if set special event return false before success", () => {
		httpTool.clearSpecialCodeEvent();
		let mockFnResolve = jest.fn(),
			mockFnReject = jest.fn();
		httpTool.setSpecialCodeEvent(code => {
			if (code === 1) {
				log("Everything is blocked after return false");
				return false;
			} else {
				return true;
			}
		});
		let ret = new Promise((resolve, reject) => {
			httpTool.post(
				url,
				() => {
					mockFnResolve();
					resolve();
				},
				() => {
					mockFnReject();
					reject();
				}
			);
		});
		ret
			.then(() => expect(mockFnResolve).not.toHaveBeenCalled())
			.catch(() => expect(mockFnReject).not.toHaveBeenCalled());
	});
	it("should go next if set special event return true before success", () => {
		httpTool.clearSpecialCodeEvent();
		let mockFn = jest.fn();
		httpTool.setSpecialCodeEvent(code => {
			if (code === 1) {
				log("Go through after execute this.");
				mockFn();
				return true;
			} else {
				return false;
			}
		});
		let ret = new Promise((resolve, reject) => {
			httpTool.post(url, resolve, reject);
		});
		ret.then(() => expect(mockFn).toHaveBeenCalled()).catch();
	});
	//endregion

	//region failure callback

	it("should run fail callback when code not over 0 when status is 200", () => {
		httpTool.clearSpecialCodeEvent();
	});
	it("should run any resulting if set special event return false", () => {
		httpTool.clearSpecialCodeEvent();
		let mockFnResolve = jest.fn(),
			mockFnReject = jest.fn();
		httpTool.setSpecialCodeEvent(code => {
			if (code === 1) {
				log("Go through after execute this.");
				return false;
			} else {
				return true;
			}
		});
		let ret = new Promise((resolve, reject) => {
			httpTool.post(
				url,
				() => {
					mockFnResolve();
					resolve();
				},
				() => {
					mockFnReject();
					reject();
				}
			);
		});
		ret
			.then(() => expect(mockFnResolve).not.toHaveBeenCalled())
			.catch(() => expect(mockFnReject).not.toHaveBeenCalled());
	});
	it("should block fail if special event return false and status equals 200 but code not over 0", function() {
		httpTool.clearSpecialCodeEvent();
		let mockFn = jest.fn();
		httpTool.setSpecialCodeEvent(code => {
			if (code < 0) {
				log("code is not over 0! Stop!");
				return false;
			} else {
				return true;
			}
		});
		let ret = new Promise((resolve, reject) => {
			httpTool.post("/success-failure", resolve, () => mockFn(), reject());
		});
		ret.catch(() => expect(mockFn).not.toHaveBeenCalled());
	});
	it("should run fail if special event return true and status is 20x but code is below 0", function() {
		httpTool.clearSpecialCodeEvent();
		let mockFn = jest.fn();
		httpTool.setSpecialCodeEvent(code => {
			if (code < 0) {
				log("code is not over 0! Go next!");
				return true;
			} else {
				return false;
			}
		});
		let ret = new Promise((resolve, reject) => {
			httpTool.post("/success-failure", resolve, () => mockFn(), reject());
		});
		ret.catch(() => expect(mockFn).toHaveBeenCalled());
	});
	it("should go next if set special event with no function", function() {
		httpTool.clearSpecialCodeEvent();
		let mockFn = jest.fn();
		httpTool.setSpecialCodeEvent("f**k");
		let ret = new Promise((resolve, reject) => {
			httpTool.post(
				"/success",
				() => {
					mockFn(), resolve();
				},
				reject
			);
		});
		ret.then(() => expect(mockFn).toHaveBeenCalled());
	});
	it("should fail if request is rejected", function() {
		httpTool.clearSpecialCodeEvent();
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post("/failure", resolve, () => {
				mockFn();
				reject();
			});
		});
		ret.catch(() => expect(mockFn).toHaveBeenCalled());
	});
	it("should fail if request is none", function() {
		httpTool.clearSpecialCodeEvent();
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post("/failure-direct", resolve, () => {
				mockFn(), reject();
			});
		});
		ret.catch(() => expect(mockFn).toHaveBeenCalled());
	});
	it("should fail if request goes unknown", function() {
		httpTool.clearSpecialCodeEvent();
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post("/failure-none", resolve, () => {
				mockFn(), reject();
			});
		});
		ret.catch(() => expect(mockFn).toHaveBeenCalled());
	});
	//endregion
	//endregion

	//region encrypt return
	it("should decrypt to empty return data to failure", function() {
		httpTool.clearEncrypt();
		httpTool.setEncrypt("key");
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post(
				"/success-empty",
				() => {
					resolve();
				},
				() => {
					mockFn();
					reject();
				}
			);
		});
		ret.catch(() => {
			expect(mockFn).toHaveBeenCalled();
		});
	});
	it("should decrypt return data to string ", function() {
		httpTool.clearEncrypt();
		httpTool.setEncrypt("key");
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post(
				"/success-string",
				() => {
					resolve();
				},
				() => {
					mockFn();
					reject();
				}
			);
		});
		ret.catch(() => {
			expect(mockFn).toHaveBeenCalled();
		});
	});
	it("should decrypt return data to success", function() {
		httpTool.clearEncrypt();
		httpTool.setEncrypt("key");
		let mockFn = jest.fn();
		let ret = new Promise((resolve, reject) => {
			httpTool.post(
				"/success-right",
				() => {
					mockFn();
					resolve();
				},
				() => {
					reject();
				}
			);
		});
		ret.then(() => {
			expect(mockFn).toHaveBeenCalled();
		});
	});
	//endregion
});
