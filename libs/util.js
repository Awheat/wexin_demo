'use strict'

var fs = require('fs');
var Promise = require('bluebird');

exports.readFileAsync = function(fpath, encoding) {
	return new Promise(function(resolve, reject) {
		fs.readFile(fpath, encoding, function(err, content){
			console.log("util: 读取txt文件");

			if(err) {
				console.log("util:报错");
				reject(err);
			}else {
				console.log("util:不报错");
				resolve(content);
			}
		})
	});
}

exports.writeFileAsync = function(fpath, content) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(fpath, content, function(err){
			console.log("util: 写入txt文件");

			if(err) {
				reject(err);
			}else {
				resolve();
			}
		})
	});
}