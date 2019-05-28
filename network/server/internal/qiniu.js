'use strict';
const qiniu = require("qiniu");

class QiNiu {
    constructor(accessKey, secretKey, bucket) {
        this.accessKey = qiniu.conf.ACCESS_KEY = accessKey;
        this.secretKey = qiniu.conf.SECRET_KEY = secretKey;
        this.bucket = qiniu.conf.bucket = bucket;
    }

    /*
     * 上传本地文件
     * @param {string} filePath 文件绝对路径
     * @param {string} key 新的文件名
     * */
    upload(filePath, key, callback) {
        let uploadToken = this.getUploadToken(key);
        let formUploader = new qiniu.form_up.FormUploader(this.getConfig());
        let putExtra = new qiniu.form_up.PutExtra();

        formUploader.putFile(uploadToken, key, filePath, putExtra, (respErr, respBody, respInfo) => {
            this.dealResult(respErr, respBody, respInfo, callback);
        });
    }

    /*
     * 处理上传结果
     * */
    dealResult(err, body, resp, callback) {
        if (err) {
            callback(err, null);
        } else if (resp.statusCode === 200) {
            callback(null, body);
        } else {
            callback(body, null);
        }
    }

    /*
     * 获取上传token
     * */
    getUploadToken(key) {
        let mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
        let putPolicy = new qiniu.rs.PutPolicy({scope: this.bucket + ":" + key});
        return putPolicy.uploadToken(mac);
    }

    /*
     * 获取上传配置
     * */
    getConfig() {
        let config = new qiniu.conf.Config();
        config.zone = qiniu.zone.Zone_z0;
        config.useHttpsDomain = true;
        config.useCdnDomain = true;
        return config;
    }
}
module.exports = QiNiu;