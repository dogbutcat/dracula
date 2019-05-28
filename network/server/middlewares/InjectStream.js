let request = require('request'),
	LogHelper = require('../../../tools/LogHelper');

let streamRoutes = {
	'/cloudfile/upload':function (myConfig) {
		return function (req,res,next){
			LogHelper.log("======upload start")
			let url = (myConfig['fileCenterIP'] || myConfig['serviceIP']) + '/cloudfile/upload';
			LogHelper.log("request path:\n", url);
			var localReq = request({
				headers:{
					"content-type":req.get('content-type'),
					"user-agent":req.get('user-agent'),
				},
				forever:true,
				"url":url,
				method:"POST",
				timeout:1000*60*5,
			}); // 记得设置 content-type 以保留 boundary
			localReq.on('error', function (err) { // fix error catch when stream breakdown
				LogHelper.log(err)
			});
			req.pipe(localReq);
			localReq.pipe(res);
			
			LogHelper.log("======upload end");
		}
	},
	"*":function (myConfig) {
		return function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
			res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	
			if (req.method == 'OPTIONS') {
				res.sendStatus(200); /让options请求快速返回/
			}
			else {
				next();
			}
		}
	}
}

function createStreamRoutes(path,setting) {
	return streamRoutes[path](setting);
}

module.exports = createStreamRoutes;