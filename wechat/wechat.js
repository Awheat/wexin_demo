var Promise = require('bluebird');
var request = Promise.promisify(require('request'));


var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
	accessToken: prefix + 'token?grant_type=client_credential'
}


/* 构造函数 */
function WeChat(opts) {
	var that = this;

	this.appID = opts.appID;
	this.appSecret = opts.appSecret;

	/* 通过app.js中的config中的两个函数挂在该实例上 */
	this.getAccessToken = opts.getAccessToken;
	this.saveAccessToken = opts.saveAccessToken;

	this.getAccessToken().then(function(data){
		console.log("1.获取AccessToken");
		try {
			/* 此处报错进入catch里面了 */
			console.log("try块");

			data = JSON.parse(data);
		}
		catch(e) {
			console.log("2.捕获异常, 执行更新重新获取函数");
			return that.updateAccessToken();
		}
		
		if(that.isValidAccessToken(data)) {
			console.log("3.合法");
			return Promise.resolve(data);
		}else {
			console.log("4.不合法");
			return that.updateAccessToken();
		}

	}).then(function(data) {

		console.log("难道走到这了");
	
		that.access_token  = data.access_token;
		that.expires_in = data.expires_in;

		that.saveAccessToken(data);
	});
}

/* 检查合法性 */
WeChat.prototype.isValidAccessToken = function(data) {


	if(!data || !data.access_token || !data.expires_in) {
		return false;
	}

	var access_token = data.access_token;
	var expires_in = data.expires_in;

	var now = (new Date().getTime());

	if(now< expires_in) {
		return true;
	}else {
		return false;
	}
}


WeChat.prototype.updateAccessToken = function(){
	var appID = this.appID;
	var appSecret = this.appSecret;
	var url = api.accessToken + '&appid='+appID+'&secret='+appSecret;


	return new Promise(function(resolve, reject) {
		request({
			url: url,
			json: true
		}).then(function(response){
			console.log(response.body);
			var data = response.body;
			var now = (new Date().getTime());


			/* 提前20秒刷新 */
			var expires_in = now + (data.expires_in-20) * 1000;
			data.expires_in = expires_in;

			resolve(data);
		});
	});

	
}


module.exports = WeChat;