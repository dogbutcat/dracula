let cookieStr, cookieObj, cookieUser, cookieHelp;
beforeEach(() => {
	cookieStr = "wow";
	cookieObj = { a: "wooo", b: ["ddee", "ffaa"] };
	cookieUser = {
		name: "a",
		pwd: "b",
		likes: ["o", "c", "u"],
		location: {
			code: 1,
			short: "BJ",
			geo: [112, 35]
		}
	};
	cookieHelp = require("../CookieHelp");
});

describe("CookieHelp TestSuit", () => {
	let CookieHelp;
	beforeAll(() => {
		CookieHelp = require("../CookieHelp");
	});
	afterAll(() => {
		CookieHelp = null;
	});
	test("Have Default User key", () => {
		expect(cookieHelp.getUserKey()).toBe("DEMON_USER");
	});
	test("clearCookie not breakdown if no cookie", () => {
		cookieHelp.clearCookie();
	});
	test("Default User Info Should not Exists", () => {
		expect(cookieHelp.getUserInfo()).toBeFalsy();
	});
	test("Can normally storage object to cookie", () => {
		cookieHelp.saveCookieInfo("cookieObj", cookieObj, 1);
		let ret = JSON.parse(cookieHelp.getCookieInfo("cookieObj"));
		expect(ret.b).toMatchSnapshot();
	});
	test("Can normally storage object to cookie", () => {
		cookieHelp.saveCookieInfo("cookieStr", cookieStr, 1);
		let ret = cookieHelp.getCookieInfo("cookieStr");
		expect(ret).toMatchSnapshot();
	});
	test("Clear cookie work properly", () => {
		CookieHelp.clearCookie();
		expect(cookieHelp.getCookieInfo("a")).toBeFalsy();
	});
	test("saveUserInfo can save User cookie and get user info not first time works", () => {
		cookieHelp.saveUserInfo(cookieUser, false);
		expect(cookieHelp.getUserInfo()).toMatchSnapshot();
	});
	test("get user info first time after save user info", () => {
		cookieHelp.first = false;
		expect(cookieHelp.getUserInfo().likes).toHaveLength(3);
	});
	test("ClearUserInfo should clean user cookie", () => {
		cookieHelp.clearUserInfo();
		expect(cookieHelp.getUserInfo()).toBeFalsy();
	});
});
