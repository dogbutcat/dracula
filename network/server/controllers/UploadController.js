let fs = require('fs'),
	path = require('path'),
	request = require('request'),
	// QiNiu = require('../internal/qiniu'),
	BaseController = require('./BaseController');

// npm i qiniu connect-multiparty --save

class UploadController extends BaseController {
constructor(setting) {
	super(setting);
}
mainEntry() {
	return (req, res, next) => {
		// try {
		// 	// this.createLog(req.files.img);
		// 	let qiniuConfig = this.Setting.qiniu, headers = req.headers, { file } = req.files, retData = {},
		// 		dataBuf = 'data:'+file.type+';base64,'+fs.readFileSync(file.path).toString('base64');
		// 	const qiniu = new QiNiu(qiniuConfig.accessKey, qiniuConfig.secretKey, qiniuConfig.bucket),timeStamp = +new Date();
		// 	let newFileName = timeStamp.toString() + '_' + file.path.split(process.platform == 'win32' ? '\\' : '/').slice(-1)[0];
		// 	qiniu.upload(file.path, newFileName, (err, resp) => {
		// 		if (err) {
		// 			// ...自己处理
		// 			res.status(900);
		// 			res.json({ code: 900, message: err.error, data: {} });
		// 		} else {
		// 			// remove base64 encode data param, encoded: dataBuf
		// 			retData = {
		// 				url: qiniuConfig.domain + newFileName,
		// 				filesize: file.size,
		// 				filetype: file.type,
		// 				fileorignalname: file.originalFilename,
		// 				filename: newFileName
		// 			}
		// 			// for IE not recognize application/json
		// 			if (headers['user-agent'].toLowerCase().indexOf('trident') != -1) {
		// 				res.set('Content-Type', 'text/html'); // if set to 'text/plain' IE 9 will wrap the body with <pre></pre> tag
		// 			}
		// 			res.json({ code: 200, message: "success", data: retData });
		// 		}
		// 	});
		// } catch (error) {
		// 		res.status(901);
		// 		res.json({
		// 			code: 901,
		// 			message: JSON.stringify(error),
		// 			data: {}
		// 		});
		// } finally {
		// 	fs.unlink(req.files.file.path);
		// }
		this.createLog('uploading');
		// global.getMappedAddr && this.checkAddrMap(req);
		// let path = req.originalUrl, url = this.CreateReqUri(path);
		// this.createLog('file path:', path);
		// let localReq = request({
		// 	url: url,
		// 	headers: {
		// 		'content-type': req.get('content-type')
		// 	}
		// });
		// req.pipe(localReq);
		// localReq.pipe(res);

		// transfer result
		try {
			if (this.Setting.fileCenterIP) {
				this.setHost(this.Setting.fileCenterIP);
			}
			let path = req.originalUrl,
				url = this.CreateReqUri(path);
			let file = req.files.file,
				headers = this.StructHeader(req);
			let options = { method:'POST',formData: req.body, url, headers, json:true};
			for (let key in req.files) {
				options.formData[key] = fs.createReadStream(req.files[key].path);
			}
			request(options).on('error',(e)=>{
				this.createLog(e)
			}).pipe(res);
		} catch (err) {
			console.error(err);
		} finally {
			fs.unlink(req.files.file.path);
		}
	};
}
}

module.exports = UploadController;