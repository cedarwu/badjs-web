var http = require('http');
var request = require('request');
var fs = require('fs');


var errorType = {
    'ECONNRESET': 'socket超时'
};
var errorHandle = function (err, tips) {
    if (err.code && errorType[err.code]) {
        console.error((tips || '') + ':' + errorType[err.code]);
    } else {
        console.error((tips || '') + ':[error code]' + err.code);
    }
};

/**
 * 发送json数据请求通过body方式
 * @param {Object} options 配置 {url: 'xxx', data: '', timeout: 60000}
 * @param {Function} callback 回调
 */
exports.postJSON = function (options, callback) {
    if (typeof options != 'object') {
        console.error('缺少请求参数');
        return false;
    }
    callback = callback || (function () {
    });

    var params = {
        url: options.url || '',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: options.data || {},
        timeout: options.timeout || 60000
    };
    var cb = function (error, response, body) {
        console.log('收到回包');
        callback(error, body);
    };
    //发送请求
    var req = request(params, cb);

    //请求错误处理
    req.on('error', function (err) {
        errorHandle(err, '连接' + options.hostname);
    });
};

exports.getPVFromLP = function (select, callback) {
    callback = callback || (function () {
    });

    var options = {
        url: 'http://cgi.lp.oa.com/glacier-query-new/cgi_server',//http://cgi.lp.oa.com/http://172.25.9.149:8080/
        data: select
    };
    exports.postJSON(options, function (err, data) {
        if (data && data.retCode === 0) {
            console.log(JSON.stringify(data));
            callback(null, data.data);
        } else {
            console.error(err, data);
            callback([err, data]);
        }
    });
};

/**
 * 通过pageid获取指定时间区间内每10分钟的pv
 * @param {String} pageId 页面id （buzid_siteid_pageid)(e.g.:"169_2122_1"）
 * @param {Number | String} startTime 201510302200
 * @param {Number | String} endTime 201510302210
 * @param {Function} callback
 */
exports.getByPageId = function(pageId, startTime, endTime, callback){
    var json = {
        "ftime": {
            "range": startTime + ',' + endTime
        },
        "measList": ["cnt"],
        "dimList": ["_10minute",
            "page"],
        "condition": {
            "page": {
                "in": pageId
            }
        },
        "group": ["ftime",
            "_10minute"],
        "limit": "0,3000",
        "query_from": 0,
        "query_id": "56331a86abe8e",
        "report_id": "514451"//,
        //"debug": 1
    };
    exports.getPVFromLP(json, callback);
};

/**
 * 按时间获取PV
 * @param {Number | String} timeString 时间点 (e.g. 201510302210)
 * @param {Function} callback 回调函数
 */
exports.getAllByTime = function(timeString, callback){
    timeString = parseInt(Number(timeString) / 10) * 10;
    var start = (timeString - 10).toString();
    var end = timeString.toString();
    var json = {
        "ftime": {
            "range": start + ',' + end
        },
        "measList": ["cnt"],
        "dimList": ["_10minute", "page"],
        "condition": {
            "_10minute": {
                "in": end.substr(-4,4)
            }
        },
        "group": {
            "0": "ftime",
            "2": "page"
        },
        "limit": "0,3000",
        "query_from": 0,
        "query_id": "56337684b8685",
        "report_id": "514451"
    };
    exports.getPVFromLP(json, callback);
};

setTimeout(function(){
    exports.getAllByTime(201510302210,function (err, data) {
        fs.writeFile('req.json', JSON.stringify(data), function (err) {

        });
    });
},1000);

exports.getByPageId('169_2122_1', 201510300000, 201510302220, function(err, data){
});

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};
console.log((new Date()).format('yyyyMMddhhmmss'));
