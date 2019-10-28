//七牛云上传token
var Config = require('./../config')
var qiniu = require('qiniu')

class Qiniu {
    constructor() {
        this.uploadToken = this.uploadToken.bind(this);
        this.mac = new qiniu.auth.digest.Mac(Config.AccessKey, Config.SecretKey);
        let options = {
            scope: Config.Bucket
        };
        this.putPolicy = new qiniu.rs.PutPolicy(options);
    }

    uploadToken(ctx, next) {
        let token = this.putPolicy.uploadToken(this.mac);
        if (token) {
            ctx.status = 200
            ctx.body = {
                data: {
                    uptoken: token
                }
            }
        } else {
            ctx.status = 500
            ctx.body = {
                data: {
                    msg:'error'
                }
            }
        }
    }
}

module.exports = new Qiniu();

