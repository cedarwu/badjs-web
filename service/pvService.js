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
        //console.log('收到回包');
        if(error){
            logger.error('请求响应错误：'+ error.toString());
        }else{
            logger.debug('请求成功');
        }
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
            //console.log(JSON.stringify(data.data));
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
var getByPageId = function (pageId, startTime, endTime, callback) {
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
var getAllByTime = function (timeString, callback) {
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
            //console.log(item);
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
                                (errs.length == 0) && (errs = null);
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
    getByDates: function (dates, callback) {
        if (!dates)
            return;
        var me = this;
        var len = dates.length;
        var errs = [];
        var pvs = {};
        (dates || []).forEach(function (date) {
            me.getByDate(date, function (err, data) {
                len--;
                if (err) {
                    errs.push(err);
                }
                pvs[date] = data;
                if (len == 0) {
                    (errs.length == 0) && (errs = null);
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
    queryByPageId: function (pageids, dates, callback) {
        var me = this;
        pageids = (typeof pageids == 'string') ? [pageids] : pageids;
        this.getByDates(dates, function (err, data) {
            //未完待续
        });
    },

    updatePVNow: function () {
        var me = this;
        var date = new Date();
        date = date.format('yyyyMMddhhmm');
        getAllByTime(date, function (err, data) {
            me.save(data, function (err, sd) {
                if (err) {
                    //console.error(err);
                    logger.error('同步pv失败' + err.toString());
                } else {
                    logger.log('同步pv成功');
                }
            });
        });
    }
};

/**
 * 任务对象
 * @constructor
 */
function Task(fn) {
    if (typeof fn != 'function') {
        console.warn('执行任务必须有操作参数');
        return;
    }
    this.fn = fn;
    this.timer = null;
    return this;
}

Task.prototype = {
    /**
     * 间隔任务
     * @param {Function} fn 任务
     * @param {Number} sleep 间隔（单位s）
     */
    trad: function (sleep) {
        var me = this;
        if (typeof sleep != 'number') {
            return this;
        }
        this.stop();
        this.timer = setInterval(function () {
            me.fn();
        }, sleep * 1000);
        return this;
    },
    stop: function () {
        if (this.timer) {
            clearInterval(this.timer);
        }
        return this;
    }
};


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

//getByPageId('169_2122_1', 201510302200, 201510311220, function (err, data) {
//    pvsg.save(data, function (err, data) {
//        //console.log(err, data);
//    });
//    pvsg.getByDates(['20151030','20151031'], function(err, data){
//        console.log('获取数据',data);
//    });
//});

//console.log(formatPV(back));
//console.log((new Date()).format('yyyyMMddhhmmss'));

module.exports = {
    //从罗盘拉取pv-日期
    getPVByDate: function (timeString, callback) {
        return getAllByTime(timeString, callback);
    },
    //从罗盘拉取pv-pageid
    getPVByPageid: function (pageId, startDate, endDate, callback) {
        return getByPageId(pageId, startDate, endDate, callback);
    },
    //创建一个pvservice实例
    create: function (config) {
        return new PVStorage(config);
    },
    //开启同步pv service
    start: function () {
        var pvService = this.create({
            filePath: '../fileStorage/',
            filePrefix: 'pv_',
            fileSuffix: ''
        });
        var task = new Task(function () {
            pvService.updatePVNow();
        }).trad(5 * 60);//5分钟同步一次;
        return pvService;
    }
};

//module.exports.start();