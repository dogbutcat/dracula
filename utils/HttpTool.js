import axios from "axios";
import _ from "lodash";
import Safe from "./Safe.js";
import CookieHelp from "./CookieHelp";

let localSafe = null;
let spEvtCb = null;
let un_id = "";
let os = "web_0.0.1";
let authCookieName = "_at"; // default Authorize Cookie Name
let authHeader = JSON.parse(CookieHelp.getCookieInfo(authCookieName) || "{}");

let sessionReqSeq = 0;

if (typeof window !== "undefined") {
	window._log =
		process.env.NODE_ENV != "production" ||
		window.localStorage.getItem("cHJpbnRsb2c") === "dHJ1ZQ"
			? console.log.bind(this)
			: () => {};
}

let typeEnum = {
	POST: "post",
	GET: "get",
	PUT: "put",
	DELETE: "delete"
};

let HttpTool = {
	setOS(val) {
		os = val;
	},

	/**
	 * set auth header
	 * @param val authorize header object
	 * @param cookieName(optional) storage cookie name
	 */
	setAuthHeader(val, cookieName) {
		let authCookie = null;
		if (cookieName) {
			CookieHelp.saveCookieInfo(cookieName, val);
		} else {
			CookieHelp.saveCookieInfo(authCookieName, val);
		}
		authHeader = val;
	},

	setEncrypt(key) {
		localSafe = new Safe(key);
	},

	setSpecialCodeEvent(cb) {
		spEvtCb = code => {
			if (typeof cb === "function") {
				return cb(code);
			} else {
				return true; // true means continue to normal steps;
			}
		};
	},

	clearOS() {
		os = "web_0.0.1";
	},

	clearAuthHeader(cookieName) {
		let authCookie = null;
		if (cookieName) {
			CookieHelp.saveCookieInfo(cookieName, CookieHelp.clearFlag, 0);
		} else {
			CookieHelp.saveCookieInfo(authCookieName, CookieHelp.clearFlag, 0);
		}
		authHeader = null;
	},

	clearEncrypt() {
		localSafe = null;
	},

	clearSpecialCodeEvent() {
		spEvtCb = null;
	},

	/**
	 *
	 * @param key
	 * @param param _开始参数,为不用参数
	 * @returns {{key: (string|*|WordArray), data: *}}
	 */
	formatBody(key, param = {}) {
		//localSafe.AESDecrypt(key,a)

		//如何参数中存在token参数,参数中的token提取,并优先于用户缓存

		// let token = "";
		// if (param && param._token) {
		// 	//清除缓用参数
		// 	token = param._token;
		// 	delete param._token;
		// } else {
		// 	let user = Storage.getUserInfo() || {};
		// 	token = user.token ? user.token.accessToken || "" : "";
		// }

		return {
			key: localSafe.encryptForRSA(key),
			data: localSafe.AESEncryption(
				key,
				JSON.stringify({
					os: os + un_id,
					param: param
				})
			)
		};
	},

	formatParamsTools(params) {
		let paramsBody = "";
		let i = 0;
		for (let key in params) {
			let v = params[key];
			if (v === undefined) {
				continue;
			}
			paramsBody += (i === 0 ? "" : "&") + (key + "=" + encodeURIComponent(v));
			++i;
		}
		return paramsBody;
	},

	clearParam(param = {}) {
		if (param) {
			delete param.navigator;
			delete param.callBack;
			//POST请求,用来跨域
		}
	},
	removeEmpty(obj) {
		if (typeof obj === "object") {
			for (let key in obj) {
				//判断是否为NULL
				// _log("obj"+key+":"+obj[key])
				if (obj[key] === undefined || obj[key] === null) {
					obj[key] = "";
					// _log("修改"+key+":"+obj[key])
				} else {
					HttpTool.removeEmpty(obj[key]);
				}
			}
		} else if (HttpTool.isArray(obj)) {
			for (let v of obj) {
				HttpTool.removeEmpty(v);
			}
		} else {
			//其他类型
		}
		return obj;
	},
	isArray(object) {
		return object && typeof object === "object" && Array == object.constructor;
	},
	randomString(len) {
		len = len || 32;
		var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
		/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length;
		var pwd = "";
		for (var i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	},
	changeEncryptOpt(url, other, noEncryptArr) {
		if (!url) {
			return other;
		}
		// url is a String
		if (noEncryptArr instanceof Array) {
			for (let value of noEncryptArr) {
				if (url.slice(0, value.length) === value) {
					other["safe"] = false;
					break;
				}
			}
		}
		return other;
	},
	getRequestHeader(other) {
		return authHeader
			? _.merge({}, authHeader, {
					"Content-Type": other.contentType,
					os
			  })
			: {
					"Content-Type": other.contentType,
					os
			  };
	}
};

function LogState() {
	this.reqApi = "";
	this.reqMethod = "";
	this.reqBody = "";
	this.respRawData = {};
	this._isSuc = true;
	this._colorPlatte = {
		default: { color: "black", "font-weight": "normal" },
		normal: { color: "black", "font-weight": "bold" },
		red: { color: "#db3b21", "font-weight": "bold" },
		gray: { color: "gray", "font-weight": "normal" },
		green: { color: "#1aaa55", "font-weight": "bold" },
		blue: { color: "#2196f3", "font-weight": "bold" },
		yellow: { color: "#ffb270", "font-weight": "bold" }
	};
	this._enableLog =
		process.env.NODE_ENV != "production" ||
		window.localStorage.getItem("cHJpbnRsb2c") === "dHJ1ZQ";
}

/**
 * @param {{api:string, body:Object, method:string}} obj -
 */
LogState.prototype.initData = function(obj) {
	if (obj) {
		this.reqApi = obj.api;
		this.reqMethod = obj.method;
		this.reqBody = JSON.stringify(obj.body, null, 2);
	}
};

LogState.prototype.setRespData = function(isSuccess, data) {
	this._isSuc = isSuccess;
	this.respRawData = JSON.parse(JSON.stringify(data, null, 2));
};

LogState.prototype.getPrintLogState = function() {
	return this._enableLog;
};

LogState.prototype.getPrintDate = function() {
	let __date = new Date();
	// return (
	// 	__date.getFullYear() +
	// 	"-" +
	// 	(__date.getMonth() + 1) +
	// 	"-" +
	// 	__date.getDate() +
	// 	" " +
	// 	__date.getHours() +
	// 	":" +
	// 	__date.getMinutes() +
	// 	":" +
	// 	__date.getSeconds() +
	// 	"." +
	// 	__date.getMilliseconds()
	// );
	return (
		"" +
		__date.getHours() +
		":" +
		__date.getMinutes() +
		":" +
		__date.getSeconds() +
		"." +
		__date.getMilliseconds()
	);
};

LogState.prototype.getStyleFromKey = function(key) {
	let __ret = "";
	if (key in this._colorPlatte) {
		let __style = this._colorPlatte[key];
		for (const key in __style) {
			if (__style.hasOwnProperty(key)) {
				const elem = __style[key];
				__ret += key + ":" + elem + ";";
			}
		}
	}
	return __ret;
};

/**
 * @param {"groupCollapsed"|"log"|"warn"|"groupEnd"} type - console type
 * @param {String} str - print string
 * @param {Array<"default"|"normal"|"red"|"blue"|"green"|"yellow">} colorList - {@link _colorPlatte}
 */
LogState.prototype.printWithStyle = function(type, str, colorList) {
	colorList = colorList && colorList.length > 0 ? colorList : ["default"];
	if (type in console) {
		let __styledArrStr = colorList.reduce((pre, cur) => {
			return pre.concat(this.getStyleFromKey(cur));
		}, []);
		console[type](str, ...__styledArrStr);
	}
};

LogState.prototype.printData = function() {
	if (this.getPrintLogState()) {
		let groupTitle = ++sessionReqSeq + ".%c[" + this.getPrintDate() + "] %c" + this.reqMethod.toUpperCase() + ": %c" +this.reqApi;
		this.printWithStyle(
			"groupCollapsed",
			groupTitle,
			this._isSuc ? ["gray", "normal", "green"] : ["gray", "normal", "red"]
		);
		this.printWithStyle("log", "%c请求body: %c\n", [
			"normal",
			"default"
		]);
		console.log(this.reqBody);
		this.printWithStyle("log", "%c返回请求: %c\n" , [
			"normal",
			"default"
		]);
		console.log(this.respRawData);
		this.printWithStyle("groupEnd", "");
	}
};

// post: (url, successCallback, failCallback, param, other) => {
// 	request('post', url, successCallback, failCallback, param, other)
// },
HttpTool["init"] = function init(options) {
	if (options) {
		Object.keys(options).forEach(val => {
			switch (val) {
				case "authCookieName":
					let cookieVal = JSON.parse(
						CookieHelp.getCookieInfo(options[val]) || "{}"
					);
					HttpTool.setAuthHeader(cookieVal, options[val]);
					break;
				case "os":
					HttpTool.setOS(options[val]);
					break;
				case "safeKey":
					HttpTool.setEncrypt(options[val]);
					break;
			}
		});
	}
};

/**
 *
 * @param reqType 请求类型 put/get/post/delete
 * @param url 请求URL
 * @param successCallback 成功返回:包含 code, message, json, option
 * @param failCallback 失败返回:code, message, option
 * @param param 请求参数 例:{id:1}
 * @param other 其他参数  {safa:booble类型 true/加密(默认) false/不加密}
 */
function mainReq(reqType, url, successCallback, failCallback, param, other) {
	//option 参数必须是对象,里面包括 (type 请求方式,url 请求路径,param 请求参数)

	// if (process.env.NODE_ENV === 'development') {
	// 	console.warn('You are in Development Mode');
	// }
	let _logger = new LogState();
	_logger.initData({ api: url, body: param, method: reqType });

	// if (!other) {
	other = !!other
		? _.merge(
				{
					safe: true,
					// contentType: "application/x-www-form-urlencoded;charset=utf-8"
					contentType: "application/json;charset=utf-8"
				},
				other
		  )
		: {
				safe: true,
				// contentType: "application/x-www-form-urlencoded;charset=utf-8"
				contentType: "application/json;charset=utf-8"
		  };
	// }
	HttpTool.clearParam(param);
	other = HttpTool.changeEncryptOpt(url, other, _NOENCRYPT);
	// _log("请求param: ", param);
	let host = _CONCAT_API + url;
	let headers = HttpTool.getRequestHeader(other);
	// _log("请求host: ", host);
	let key = (localSafe && localSafe.getRandomStr(16)) || "";
	let body =
		localSafe && other.safe
			? HttpTool.formatBody(key, param)
			: JSON.stringify(param);
	body =
		other.contentType.indexOf("json") === -1
			? HttpTool.formatParamsTools(body)
			: body;
	// _log("请求body: ", param);

	let options = {
		url: host,
		method: reqType.toLowerCase(),
		headers,
		timeout:
			other["timeout"] != 0 && other["timeout"]
				? parseInt(other.timeout) * 1000
				: 11000
	};
	reqType === "get" ? (options["params"] = param) : (options["data"] = body);
	axios(options)
		.then(({ status, data }) => {
			let json = data,
				code = status;
			//解密
			if (other.safe && json.isSafe && localSafe) {
				json = localSafe.AESDecrypt(key, json.data);
				if (!json) {
					let option = {
						code: -998,
						message: "系统繁忙,请稍候再试",
						host: host,
						option: {}
					};
					failCallback(option.code, option.message, option);
					return;
				} else {
					try {
						json = JSON.parse(json);
					} catch (e) {
						let option = {
							code: -997,
							message: "返回数据格式化失败",
							host: host,
							option: {}
						};
						failCallback(option.code, option.message, option);
						return;
					}
				}
			}

			// json = HttpTool.removeEmpty();
			var option = {
				code:
					json.code === 1 || (200 <= json.code && json.code < 300)
						? 1
						: -json.code,
				message: json.message,
				host: host,
				option: json.option
			};
			// _log("------success--------");
			// _log(option);
			// _log(json);
			_logger.setRespData(option.code > 0, { option, data: json.data });
			_logger.printData();
			try {
				if (option.code > 0) {
					if (!spEvtCb) {
						successCallback(option.code, option.message, json.data, option);
					} else {
						if (spEvtCb(option.code)) {
							successCallback(option.code, option.message, json.data, option);
						}
					}
				} else {
					if (!spEvtCb) {
						failCallback(option.code, option.message, option);
					} else {
						if (spEvtCb(option.code)) {
							failCallback(option.code, option.message, option);
						}
					}
				}
			} catch (error) {
				_log("-----callback execute error---------");
				console.error(error);
			}
		})
		.catch(error => {
			// _log("-----error---------");
			console.error(error);
			try {
				if (error.response) {
					let option = {
						code: error.response.status,
						message: error.message,
						host: host,
						option: {}
					};
					// _log(option);

					// // The request was made and the server responded with a status code
					// // that falls out of the range of 2xx
					// _log(error.response.data);
					// _log(error.response.headers);
					_logger.setRespData(option.code > 0, option);
					_logger.printData();
					failCallback(error.response.status, error.message, option);
				} else if (error.request) {
					let option = {
						code: error.request.status,
						message: "请检查网络连接",
						host: host,
						option: {}
					};
					// _log(option);
					// The request was made but no response was received
					// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
					// http.ClientRequest in node.js
					_logger.setRespData(option.code > 0, option);
					_logger.printData();
					failCallback(error.request.status, option.message, option);
				} else {
					_logger.setRespData(false, {});
					_logger.printData();
					failCallback(-999, "请求未知错误", {});
				}
			} catch (err) {
				_logger.setRespData(false, {});
				_logger.printData();
				failCallback(-999, err.message, {});
			}
			// console.log(error.config);
		});
}

Object.keys(typeEnum).forEach(val => {
	HttpTool[val.toLowerCase()] = function(
		url,
		successCallback,
		failCallback,
		param,
		reqOptions
	) {
		mainReq(
			val.toLowerCase(),
			url,
			successCallback,
			failCallback,
			param,
			reqOptions
		);
	};
});

module.exports = HttpTool;
