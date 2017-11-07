'use strict'

var xml2js = require('xml2js');
var Promise = require('bluebird');

exports.parseXMLAsync = function(xml) {
	return new Promise(function(resolve, rejcet){
		xml2js.parseString(xml, {trim: true}, function(err, content){
			if(err) rejcet(err)
			else resolve(content)
		})
	})
}