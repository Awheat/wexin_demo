var sha1 = require('sha1');
var getRawBody = require('raw-body');

var util = require('./util');
var WeChat = require('./wechat');




/* 暴露Fun:  token验证并初始化WeChat函数获取access_token */
module.exports = function(opts){

	/* 实例化构造函数 */
	//var wechat = new WeChat(opts);

	return function *(next){
		var token = opts.token;
		var signature = this.query.signature;
		var nonce = this.query.nonce;
		var timestamp = this.query.timestamp;
		var echostr = this.query.echostr;
		var str = [token,timestamp,nonce].sort().join('');
		var sha = sha1(str);

		if(this.method === 'GET') {
			if(sha === signature){
				this.body = echostr + '';
			}else{ 
				this.body = 'wrong';
			}
		}else if(this.method === 'POST') {
			if(sha !== signature){
				this.body = 'wrong';
				return false;
			}


			console.log("进入post代码块");

			var data = yield getRawBody(this.req, {
				length: this.length,
				limit: '1mb',
				encoding: this.charset
			})


			var content = yield util.parseXMLAsync(data);
			console.log(data);
		}

		
	}
}