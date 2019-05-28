let path = require('path'),
	{ getlibRootPath } = require('../../api/ApiTool');
let Setting = {
	DEV: false,
	ssr: false,
	// ipPass: {
	// 	type: 'query', // or 'path',
	// 	queryKey: 'ip' // preserve param key for type in query mode
	// },
	serviceIP: "http://10.0.0.182:9092",
	// fileCenterIP: "http://10.0.0.182:9092", // file center ip if not exist default service ip
	// qiniu: {
	// 	domain: 'domain',
	// 	accessKey: 'accessKey',
	// 	secretKey: 'secretKey',
	// 	bucket: 'bucket'
	// },
	browserSupport: 8,
	blockPageName: 'hintPage.html',
	port: 3001, //项目监听端
	restfulSupport: ['post', 'get', 'put', 'delete'], // element not in array will use default below
	viewPath: path.resolve(getlibRootPath(), "network/server/views"),
	assetPath: path.resolve(getlibRootPath(), "public"),
	transferHeader: "API",
	acceptHeaders: ['user-agent', 'origin', 'cookie', 'referer','os','Authorization'],
	contentEncoding: 'gzip, deflate, br'
};

module.exports = Setting;