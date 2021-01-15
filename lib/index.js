const _ = require('lodash');
const crypto = require("crypto");
const request = require('request');
let key = "";
let customer = "";

const urlConfig = {
	query:"https://poll.kuaidi100.com/poll/query.do"
}

const getSign = function(param){
	const str = JSON.stringify(param)+key+customer;
	let m = crypto.createHash('md5');
	m.update(str, 'utf8');
	return m.digest('hex').toUpperCase();
}


/**
 * 订单查询
 * @param {Object} param 请求参数
 * param内容
 * @param {String} com 查询的快递公司的编码， 一律用小写字母
 * @param {String} num 查询的快递单号， 单号的最大长度是32个字符
 */
const query = function(param){
	const body = {
		customer:customer,
		sign:getSign(param),
		param:JSON.stringify(param)
	};
	var options = {
		url:urlConfig.query,
		method:"POST",
		headers:{
			"content-type":"application/x-www-form-urlencoded"
		},
		form:body
	};

	return new Promise(function(resolve,reject){
		request(options,function(error, response, body){
			console.log(error,body)
			if(error){
				return reject(error);
			}
			try{
				resolve(param.show != 0 ? body:(body!=""?JSON.parse(body):body));
			}catch(err){
				reject(err)
			}
			
		});
	});
}


exports.initClient = function(params){
	if(!params){
		console.log("can't found params. 缺少初始化参数");
		return ;
	}
	if(!params.key){
		console.log("can't found key. 缺少key");
		return ;
	}
	if(!params.customer){
		console.log("can't found customer. 缺少customer");
		return ;
	}
	key = params.key;
	customer = params.customer;
	
	return {
		query:query
	}
}