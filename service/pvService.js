/**
 * Created by donaldcen on 2015/10/31.
 */
var http = require('http');
var request = require('request');
var fs = require('fs');
var FileStorage = require('./FileStorage.js');
var log4js = require('log4js'),
    logger = log4js.getLogger();

/**
 * 扩展时间对象提供格式化方法
 * @param {String} format 格式化字符串(yyyyMMddhhmmss)
 * @returns {*}
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

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
var postJSON = function (options, callback) {
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
/**
 * 通过罗盘接口获取实时pv
 * @param {Object | json} select 获取数据的原始查询json
 * @param {Function} callback 回调函数
 */
var getPVFromLP = function (select, callback) {
    callback = callback || (function () {
    });

    var options = {
        url: 'http://cgi.lp.oa.com/glacier-query-new/cgi_server',//http://cgi.lp.oa.com/http://172.25.9.149:8080/
        data: select
    };
    logger.info('发送罗盘请求' + JSON.stringify(select));
    postJSON(options, function (err, data) {
        if (data && data.retCode === 0) {
            console.log(JSON.stringify(data.data));
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
exports.getByPageId = function (pageId, startTime, endTime, callback) {
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
    getPVFromLP(json, function (err, data) {
        if (!err && data.body) {
            callback(null, data.body);
        } else {
            callback(err, data);
        }
    });
};

/**
 * 按时间获取PV
 * @param {Number | String} timeString 时间点 (e.g. 201510302210)
 * @param {Function} callback 回调函数
 */
exports.getAllByTime = function (timeString, callback) {
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
                "in": end.substr(-4, 4)
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
    getPVFromLP(json, function (err, data) {
        if (!err && data.body) {
            callback(null, data.body);
        } else {
            callback(err, data);
        }
    });
};

/**
 * 格式化pv
 */
var formatPV = function (pvdata) {
    //console.log(pvdata);
    var rtnO = {};
    for (var date in pvdata) {
        !rtnO[date] && (rtnO[date] = {});
        (pvdata[date] || []).forEach(function (item) {
            console.log(item);
            if (!item) return;
            var ftime = item[0];
            var pageid = item[1];
            var pv = item[2];
            if (!rtnO[date][pageid]) {
                rtnO[date][pageid] = {};
            }
            rtnO[date][pageid][ftime] = pv;
        });
    }
    return rtnO;
};

/**
 * PVStorage
 * @constructor
 */
function PVStorage(config) {
    this.options = {
        filePath: config.filePath || './',
        filePrefix: config.filePrefix || 'pv_',
        fileSuffix: config.fileSuffix || ''
    };
    //{20151030:FileStorage}
    this.files = {};

}

PVStorage.prototype = {

    /**
     * 更新数据入库
     * @param {Object} data 数据
     * @param {Function} callback 回调
     */
    save: function (data, callback) {
        var ds = formatPV(data);
        var me = this;
        var lens = 0;
        var errs = [];
        //按日期循环写入
        for (var i in ds) {
            if (ds.hasOwnProperty(i)) {
                lens++;
                //闭包保存变量
                (function (i, wds) {
                    //获取filestorage
                    me.openFile(i, function (err, fileStorage) {
                        if (err) {
                            errs.push(err);
                        }
                        lens--;
                        //更新文件内容
                        fileStorage.update(wds, function (err) {
                            if (err) {
                                errs.push(err);
                            }
                            //执行外部来源回调
                            if (lens == 0) {
                                lens = null;
                                (typeof callback == 'function') && callback(errs, data);
                            }
                        });
                    });
                })(i, ds[i]);
            }
        }

    },
    /**
     * 初始化fileStorage
     * @param {String} dateStr 日期（20151030）
     * @param {Function} callback 回调
     */
    openFile: function (dateStr, callback) {
        var opt = this.options;
        if (this.files[dateStr]) {
            callback(null, this.files[dateStr]);
        } else {
            this.files[dateStr] = new FileStorage(opt.filePath + opt.filePrefix + dateStr + opt.fileSuffix, function (err, fileStorage) {
                callback(err, fileStorage);
            }, false);
        }
    },
    /**
     * 按天获取pv数据
     * @param {String} dateStr 日期（20151030）
     * @param {Function} callback
     */
    getByDate: function (dateStr, callback) {
        this.openFile(dateStr, function (err, fileStorage) {
            fileStorage.read(function (err, data) {
                callback(err, data);
            });
        });
    },

    /**
     * 获取多天数据
     * @param {Array<String>} dates 日期数组
     * @param {Function} callback
     */
    getByDates: function(dates, callback) {
        if (!dates)
            return;
        var me = this;
        var len = dates.length;
        var errs = [];
        var pvs = {};
        (dates || []).forEach(function(date){
            me.getByDate(date, function(err, data){
                len--;
                if(err){
                    errs.push(err);
                }
                pvs[date] = data;
                if(len == 0){
                    callback(errs, pvs);
                }
            });
        });
    },
    /**
     * 获取指定pageId的pv数据,最多24小时
     * @param {String | Array<String>} pageids 页面id列表
     * @param {String} startDate
     * @param {String} endDate
     * @param callback
     */
    queryByPageId: function (pageids, startDate, endDate, callback) {
        var me = this;
        pageids = (typeof pageids == 'string') ? [pageids] : pageids;
        var start = Number(startDate);
        var end = Number(endDate);
        var pvs = {};
        var deta = end - start + 1;
        var errs = [];
        //限制最多只能拉10天
        if (deta <= 10 && start > 20151000 && start < 20451001) {
            while(start <= end){
                (function(date){
                    me.getByDate(date, function(err, data){
                        deta--;
                        if(err){
                            errs.push(err);
                        }


                        //最后一个回来执行总回调
                        if(deta == 0){
                            callback(errs, pvs);
                        }
                    });
                })(start++);
            }
        } else {
            callback('拉取时间参数错误,最多只能拉取10天');
        }

    }
};

var pvsg = new PVStorage({
    filePath: '../fileStorage/',
    filePrefix: 'pv_',
    fileSuffix: ''
});
//exports.getAllByTime(201510302220, function (err, data) {
//    pvsg.save(data, function (err, data) {
//        console.log(err, data);
//    });
//});

//pvsg.getByDate('20151030', function (err, data) {
//    console.log(err, data);
//});
//pvsg.getByDate('20151030', function (err, data) {
//    console.log(err, data);
//});


//setTimeout(function () {
//    exports.getAllByTime(201510302210, function (err, data) {
//        fs.writeFile('req.json', JSON.stringify(data), function (err) {
//
//        });
//    });
//}, 1000);

exports.getByPageId('169_2122_1', 201510302200, 201510311220, function (err, data) {
    pvsg.save(data, function (err, data) {
        //console.log(err, data);
    });
    pvsg.getByDates(['20151030','20151031'], function(err, data){
        console.log('获取数据',data);
    });
});

//var back = {"20151030":[["2220","169_2122_1","8171"],["2210","169_2122_1","8576"],["2200","169_2122_1","8701"],["2150","169_2122_1","8935"],["2140","169_2122_1","8829"],["2130","169_2122_1","9022"],["2120","169_2122_1","8797"],["2110","169_2122_1","8932"],["2100","169_2122_1","9167"],["2050","169_2122_1","9359"],["2040","169_2122_1","9291"],["2030","169_2122_1","8988"],["2020","169_2122_1","9106"],["2010","169_2122_1","8710"],["2000","169_2122_1","8582"],["1950","169_2122_1","8574"],["1940","169_2122_1","8437"],["1930","169_2122_1","8292"],["1920","169_2122_1","8217"],["1910","169_2122_1","8016"],["1900","169_2122_1","7895"],["1850","169_2122_1","7476"],["1840","169_2122_1","7301"],["1830","169_2122_1","6969"],["1820","169_2122_1","6636"],["1810","169_2122_1","6382"],["1800","169_2122_1","6309"],["1750","169_2122_1","6210"],["1740","169_2122_1","5884"],["1730","169_2122_1","5632"],["1720","169_2122_1","5546"],["1710","169_2122_1","5372"],["1700","169_2122_1","4816"],["1650","169_2122_1","4799"],["1640","169_2122_1","4452"],["1630","169_2122_1","4228"],["1620","169_2122_1","4113"],["1610","169_2122_1","3861"],["1600","169_2122_1","3736"],["1550","169_2122_1","3574"],["1540","169_2122_1","3412"],["1530","169_2122_1","3394"],["1520","169_2122_1","3366"],["1510","169_2122_1","3413"],["1500","169_2122_1","3245"],["1450","169_2122_1","3219"],["1440","169_2122_1","3064"],["1430","169_2122_1","3075"],["1420","169_2122_1","3092"],["1410","169_2122_1","3035"],["1400","169_2122_1","3144"],["1350","169_2122_1","3171"],["1340","169_2122_1","3352"],["1330","169_2122_1","3735"],["1320","169_2122_1","4058"],["1310","169_2122_1","4411"],["1300","169_2122_1","4306"],["1250","169_2122_1","4527"],["1240","169_2122_1","4375"],["1230","169_2122_1","4344"],["1220","169_2122_1","3930"],["1210","169_2122_1","3670"],["1200","169_2122_1","3169"],["1150","169_2122_1","3249"],["1140","169_2122_1","3049"],["1130","169_2122_1","2951"],["1120","169_2122_1","3052"],["1110","169_2122_1","2930"],["1100","169_2122_1","2806"],["1050","169_2122_1","2928"],["1040","169_2122_1","2767"],["1030","169_2122_1","2674"],["1020","169_2122_1","2631"],["1010","169_2122_1","2567"],["1000","169_2122_1","2360"],["0950","169_2122_1","2323"],["0940","169_2122_1","2428"],["0930","169_2122_1","2506"],["0920","169_2122_1","2496"],["0910","169_2122_1","2434"],["0900","169_2122_1","2441"],["0850","169_2122_1","2353"],["0840","169_2122_1","2218"],["0830","169_2122_1","2167"],["0820","169_2122_1","2092"],["0810","169_2122_1","1907"],["0800","169_2122_1","1889"],["0750","169_2122_1","1896"],["0740","169_2122_1","1762"],["0730","169_2122_1","1708"],["0720","169_2122_1","1702"],["0710","169_2122_1","1619"],["0700","169_2122_1","1593"],["0650","169_2122_1","1569"],["0640","169_2122_1","1407"],["0630","169_2122_1","1315"],["0620","169_2122_1","1120"],["0610","169_2122_1","1008"],["0600","169_2122_1","828"],["0550","169_2122_1","701"],["0540","169_2122_1","592"],["0530","169_2122_1","465"],["0520","169_2122_1","421"],["0510","169_2122_1","374"],["0500","169_2122_1","336"],["0450","169_2122_1","304"],["0440","169_2122_1","314"],["0430","169_2122_1","328"],["0420","169_2122_1","302"],["0410","169_2122_1","274"],["0400","169_2122_1","334"],["0350","169_2122_1","321"],["0340","169_2122_1","386"],["0330","169_2122_1","364"],["0320","169_2122_1","385"],["0310","169_2122_1","392"],["0300","169_2122_1","441"],["0250","169_2122_1","431"],["0240","169_2122_1","435"],["0230","169_2122_1","501"],["0220","169_2122_1","584"],["0210","169_2122_1","625"],["0200","169_2122_1","639"],["0150","169_2122_1","701"],["0140","169_2122_1","862"],["0130","169_2122_1","930"],["0120","169_2122_1","1098"],["0110","169_2122_1","1196"],["0100","169_2122_1","1380"],["0050","169_2122_1","1551"],["0040","169_2122_1","1829"],["0030","169_2122_1","2129"],["0020","169_2122_1","2439"],["0010","169_2122_1","2744"],["0000","169_2122_1","3202"]]};
//
//console.log(formatPV(back));


console.log((new Date()).format('yyyyMMddhhmmss'));
