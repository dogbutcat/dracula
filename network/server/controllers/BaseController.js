let request = require('request'),
	LogHelper = require('../../../tools/LogHelper');

/**
 * Base Controller for different route controller to extend
 * MUST to pass setting params when construct it
 */
class BaseController{
	constructor(setting) {
		this.Setting = setting; // import global setting
		this.Host = this.Setting.serviceIP;
	}
	/**
	 * set current host to target host
	 * @param {* target host to set} host 
	 */
	setHost(host) {
		this.Host = host;
	}
	/**
	 * get current host
	 */
	getHost() {
		// return this.Host;
		return this.Setting.serviceIP;
	}
	/**
	 * reset host back to main address
	 */
	resetHost() {
		this.Host = this.Setting.serviceIP;
	}
	/**
	 * setHost according to route map
	 * @param {Request} req 
	 */
	checkAddrMap(req) {
		let originalUrl = req.headers.referer || "",ip_keys = req.header("ip_keys")||'', result = null;
		result = (global.getMappedAddr(ip_keys, originalUrl));
		result && this.setHost(result);
	}
	/**
	 * get client ip
	 * @param {Request} req - request
	 */
	getClientIp(req) {
		let reqHeaders = req.headers;
		return reqHeaders['x-forwarded-for'] ||
		reqHeaders["x-real-ip"] ||
		reqHeaders["proxy-client-ip"] ||
		reqHeaders["wl-proxy-client-ip"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
	}
	/**
	 * construct headers to transfer
	 * @param {Request} req 
	 */
	StructHeader(req) {
		let heads = {},
            reqHeaders = req.headers,
            { acceptHeaders } = this.Setting;
		heads["Accept"] = "application/json";
		heads['x-real-ip'] = this.getClientIp(req);
        // heads['Content-Type'] = 'application/json;charset=UTF-8';
        // heads['accessToken'] = '%7B%22userId%22%3A%22ee2d901a8e4f494da5390092f76b1asd%22%2C%22accountId%22%3A%223acaaf2ce86e43e49fbcfbf43376czxc%22%2C%22accountType%22%3A2%2C%22userName%22%3A%22ywbaoji%22%2C%22secret%22%3A%22671a08a9029f6b81037f1830a5a29cb0%22%2C%22index%22%3A0%2C%22ahead%22%3A1504846789126%7D';//todo 记得删除掉
        // req.headers.cookie = '';
        for (var v of acceptHeaders) {
            reqHeaders[v.toLowerCase()] &&
                (heads[v] = reqHeaders[v.toLowerCase()]);
        }
        return heads;
	}
	/**
	 * Combine path and host
	 * @param {* request relative path} path 
	 */
	CreateReqUri(path) {
		return this.getHost() + (path ? path : '');
	}
	/**
	 * Create form-data Param String
	 * @param {* express app func request} req 
	 * @param {* params need to construct to form-data type} isQuery 
	 */
	CreateParamString(req, isQuery) {
		let i = 0, param = req.body, key = null, temp = '', connectStr = isQuery ? '?' : '';
		for (key in param) {
			typeof param[key] == 'object' && (param[key] = JSON.stringify(param[key]));
			temp += i == 0 ? (connectStr + key + '=' + encodeURIComponent(param[key])) : ('&' + key + '=' + encodeURIComponent(param[key]));
			++i;
		}
		return temp;
	}
	/**
	 * Check request type allowed in server sets
	 * @param {* express app func request} req 
	 */
	CheckReqTypeExist (req){
		let { restfulSupport } = this.Setting, { reqType } = req.params;
		LogHelper.log(reqType);
		return (reqType && restfulSupport.indexOf(reqType) > 0) ? reqType : restfulSupport[0];
	}
	/**
	 * Send request to target server and feed back to client
	 * @param {* reqType like post,get...} reqType 
	 * @param {* request object, {url,body...}} main 
	 * @param {* express app func response} res 
	 * @param {* request path, for print usage} path 
	 */
	SendRequest(reqType, main, res, path) {
		let { contentEncoding } = this.Setting;
		!(contentEncoding =='none') && (main.headers['accept-encoding'] = contentEncoding, main['gzip'] = true)
			|| (main.headers['accept-encoding'] = contentEncoding); // set gzip compress options to true to prevent encoding errors
		// request[reqType](
		// 	main,
		// 	function (err, httpResponse, body) {
		// 		LogHelper.log("====返回 err:" + err);
		// 		if (err) {
		// 			res.statusCode = 505;
		// 			res.send(JSON.stringify({ code: 505, message:'Remote Server Error'}));
		// 		} else {
		// 			LogHelper.log("====返回 path:" + path + " statusCode: " + httpResponse.statusCode);
		// 			LogHelper.log("====返回 path:" + path + " body: " + body);
		// 			if (httpResponse.statusCode == 200) {
		// 				res.send(body);
		// 			} else {
		// 				res.statusCode = httpResponse.statusCode;
		// 				res.send(body);
		// 			}
		// 		}
		// 	});
		request[reqType](main).on('error', function(err) { // fix error catch when stream breakdown
            LogHelper.log(err)
        }).pipe(res);
	}


	createLog(val){
		LogHelper.log(val);
	}
}

module.exports = BaseController;