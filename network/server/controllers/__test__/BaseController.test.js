describe("BaseController TestSuit", () => {
	let baseController, mockReq;
	beforeAll(() => {
		let BaseController = require("../BaseController");
		let Config = require("../../../../config/server/setting");
		baseController = new BaseController(Config);
		mockReq = {
			headers: {
				"user-agent": "aaa",
				os: "web_0.2.2",
				cookie: "best=42123",
				authorization: "bbb",
				referer: "ccc",
				origin: "ddd",
				dnt: 1
			}
		};
	});
	it("Struct Headers should have Authorization", () => {
		let result = baseController.StructHeader(mockReq);
		expect(result).toHaveProperty("Authorization");
	});
	it("Struct Headers should be case-sensitive", () => {
		let result = baseController.StructHeader(mockReq);
		expect(result).not.toHaveProperty("authorization");
	});
	it("Struct Headers should filter correct", () => {
		let result = baseController.StructHeader(mockReq);
		expect(result).not.toHaveProperty("dnt");
	});
});
