/* 系统库文件 */
var Koa = require('koa');
var path = require('path');


/* 自己文件 */
var wechat = require('./wechat/g');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat.txt');


/* 微信配置文件 */
var config = {
	wechat: {
		appID: "wx4fcc2e704a9e58aa",
		appSecret: "f70a4e1c4be156698cb689747ba4f7af",
		token:"wuwangcheng",
		getAccessToken : function(){
			return util.readFileAsync(wechat_file, 'utf-8');
		},
		saveAccessToken: function(data){
			var data = JSON.stringify(data);
			return util.writeFileAsync(wechat_file,data);
		}
	}
}
/* 实例化Koa框架 */
var app = new Koa();

/* 中间件 */
app.use(wechat(config.wechat));



/* 监听 */
app.listen(80);
console.log('app started at port 80');