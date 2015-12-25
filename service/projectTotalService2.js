/**
 * pv统计service
 * Created by donaldcen on 2015/11/01
 * @constructor
 */

var pageConfig = require('../fileStorage/pageid.js');
var PvService = require('./PvService');
var dateFormat = require('../utils/dateFormat');
var LogService = require('../service/LogService');
var FileStorage = require('./FileStorage');
var fs = require('fs');
var path = require('path');
var log4js = require('log4js'),
    http = require('http'),
    _ = require('underscore'),
    logger = log4js.getLogger();
//var filePath = path.resolve(GLOBAL.pjconfig.fileStorage.pageid);

/**
 * 转换pageMap
 * @param {json} pageconfig 页面id配置
 * @returns {{}}
 */
//var page2Map = function (pageconfig) {
//    var map = {};
//    for (var i in pageconfig) {
//        var pageid = i.replace(/-/g, '_');
//        if (!map[pageconfig[i]]) {
//            map[pageconfig[i]] = [];
//        }
//        if (!(i in map[pageconfig[i]])) {
//            map[pageconfig[i]].push(pageid);
//        }
//    }
//    return map;
//};

/**
 * 字符串转时间
 * @param str
 */
var string2Date = function (str, format) {
    var timeStr = {
        y: '',
        M: '',
        d: '',
        h: '',
        m: '',
        s: ''
    };
    var time;
    var len = format.length;
    for (var i = 0; i < len; i++) {
        if (typeof timeStr[format[i]] != 'undefined') {
            timeStr[format[i]] += str[i];
        }
    }
    time = new Date(timeStr.y + '/' + timeStr.M + '/' + timeStr.d + ' ' + timeStr.h + ':' + timeStr.m + ':' + timeStr.s);
    return time;
};

/**
 * 重新拉取配置文件
 */
var reloadFileConfig = function () {
    try {
        var config = fs.readFileSync(filePath);
        console.log(config);
        pageConfig = config;
    } catch (e) {
        logger.error('配置文件解析错误:' + e.message + e.stack);
    }
};

function StatisticsServicePV() {
    this.pageMap = pageConfig;
    this.pvService = PvService.getServices()[0] || PvService.create();
    this.options = {
        filePath: __dirname + '/../fileStorage/total'
    };
    this.files = {};
    this.url = GLOBAL.pjconfig.storage.errorMsgTopUrl;
}


StatisticsServicePV.prototype = {
    /**
     * 初始化fileStorage
     * @param {String} key 日期（20151030）
     * @param {Function} callback 回调
     */
    openFile: function (callback) {
        var key = '1';
        var opt = this.options;
        if (this.files[key]) {
            callback(null, this.files[key]);
        } else {
            this.files[key] = new FileStorage(opt.filePath.replace(/\{date\}/g, key), function (err, fileStorage) {
                callback(err, fileStorage);
            }, false);
        }
    },
    /**
     * 存入统计数据
     * @param {Object} data 存入内容
     * @param {Function} callback
     */
    save: function (data, callback) {
        var me = this;
        me.openFile(function (err, fileStorage) {
            if (err) {
                callback(err);
            } else {
                fileStorage.update(data, function (err, data) {
                    callback(err, data);
                });
            }

        });
    },


    /**
     * 获取多天的数据
     * @param {String | Array} appids 项目id
     * @param {String | Number} timeScope 时间戳(20151011)
     * @param {Function} callback
     */
    queryByDays: function (appids, timeScope, callback) {
        var oneDay = 1000 * 60 * 60 * 24;
        if (typeof appids == 'string') {
            appids = [appids];
        }
        var dates = [];
        for (var i = timeScope; i > 0; i--) {
            dates.push(dateFormat(new Date(new Date() - oneDay * i), 'yyyyMMdd'));
        }

        this.query(function (err, data) {

            var _data = {};
            if (data) {
                //遍历appid
                appids.forEach(function (appid) {
                    _data[appid] = {};
                    //遍历日期
                    dates.forEach(function (date) {
                        //console.log(id, date, data[id][date]);
                        if (data[appid] && data[appid][date]) {
                            _data[appid][date] = data[appid][date];
                        }
                    });
                });

                callback(null, _data);
            } else {
                callback(err);
            }
        });
    },

    /**
     * 拉取数据
     * @param callback
     */
    query: function (callback) {
        this.openFile(function (err, fileStorage) {
            if (fileStorage) {
                fileStorage.read(function (err, data) {
                    callback(err, data);
                });
            } else {
                callback(err);
            }
        })
    },
    /**
     * 拉取PV汇总
     * @param dateStr
     */
    processPV: function (dateStr, callback) {
        callback = callback || (function () {
            });
        var me = this;
        var totals = {};
        me.pvService.getByDate(dateStr, function (err, data) {
            if (typeof data == 'object') {
                for (var appid in me.pageMap) {
                    (me.pageMap[appid] || []).forEach(function (pageid) {
                        if (data[pageid]) {
                            (typeof totals[appid] == 'undefined') && (totals[appid] = 0);
                            totals[appid] += me.countPv(data[pageid]);
                        }
                    });
                }
            }
            callback(err, totals);
        });
    },

    /**
     * 拉取错误总数
     * @param dataStr
     * @param callback
     */
    processTotal: function (dataStr, callback) {
        callback = callback || (function () {
            });
        var me = this;
        var appids = [];
        var totals = {};
        Object.keys(me.pageMap).forEach(function (key, value) {
            appids.push(key);
        });
        var fetch = function () {
            var id = appids.pop();
            if (id) {
                me.getTotalById(id, dataStr, function (err, total) {
                    if (err) {
                        console.error('[projectTotalService Error] get ' + id + ' total error');
                    } else {
                        console.log('get', id, total);
                        totals[id] = total;
                    }
                    fetch();
                });
            } else {
                callback(null, totals);
            }
        };
        fetch();
    },

    fetchAndSave: function(date, callback){
        callback = callback || (function(){});
        var me = this;
        me.update(date, function(err, data){
            if(data){
                data = me.countEent(data);
            }
            me.save(data, callback);
        });
    },
    /**
     * 更新
     */
    update: function (dateStr, callback) {
        var me = this;
        var formatDate = dateFormat(dateStr, 'yyyyMMdd');
        callback = callback || (function () {
            });
        var apps = {};
        var len = 2;
        //存如apps
        var cb = function (key, data) {
            len--;
            if (data) {
                Object.keys(data).forEach(function (appid, index) {
                    (!apps[appid]) && (apps[appid] = {});
                    (!apps[appid][formatDate]) && (apps[appid][formatDate] = {});
                    apps[appid][formatDate][key] = data[appid];
                });
            }
            if(!len){
                callback(null, apps);
            }
        };
        me.processPV(formatDate, function (err, data) {
            cb('pv', data);
        });
        me.processTotal(dateStr, function (err, data) {
            cb('total', data)
        });
    },

    /**
     * 拉取总数
     * @param id
     * @param startDate
     * @param cb
     */
    getTotalById: function (id, startDate, cb) {
        if (typeof startDate == 'string') {
            startDate = new Date(startDate);
        }
        cb = cb || (function () {
            });
        http.get((this.url + '?id=' + id + '&startDate=' + (startDate - 0 )), function (res) {
            var buffer = '';
            res.on('data', function (chunk) {
                buffer += chunk.toString();
            }).on('end', function () {
                try {
                    var result = JSON.parse(buffer);

                    cb(null, result.pv);
                } catch (err) {
                    logger.error('error :' + err);
                    cb(err);
                }
            })

        }).on('error', function (err) {
            logger.error('error :' + err);
            cb(err);
        });
    },

    /**
     * 格式化总数
     * @param {Object} obj 数据 {id: number, id: number, ...}
     * @param {String} date 时间戳
     */
    parseTotal: function (date, obj) {
        var _data = {};
        for (var id in obj) {
            if (!_data[id]) {
                _data[id] = {}
            }
            _data[id][date] = {
                total: obj[id]
            }
        }
        return _data;
    },

    /**
     * 统计pv
     * @param {Array} pvs {'0000':'100','0010':'123'}
     * @returns {{}}
     */
    countPv: function (pvs) {
        var total = 0, temp;
        for (var t in pvs) {
            if ((temp = Number(pvs[t])) > 0) {
                total += temp;
            }
        }
        return total;
    },
    /**
     * 计算百分比
     */
    countEent: function (data) {
        var temp;
        for (var appid in data) {
            if (typeof data[appid] == 'object') {
                for (var date in data[appid]) {
                    if ((temp = data[appid][date]) && temp.pv && temp.total) {
                        data[appid][date].cent = Number((temp.total / temp.pv * 100).toFixed(2));
                    }
                }
            }
        }
        return data;
    },
    start: function(){
        var me = this;
        var day;
        setInterval(function(){
            var date = new Date();
            var _day = date.getDate();
            if(day != _day){
                day = _day;
                me.fetchAndSave(date,function(){
                    console.log('同步完成'+date.toString());
                });
            }
        },60*60*1000);
    }
};

module.exports = StatisticsServicePV;
//
//var ss = new StatisticsServicePV();
//ss.processPV('20151102', function(err, total){
//    console.log('回报',err, total);
//});
//ss.query(function(err, data){
//    ss.save(ss.countEent(data), function(err, data){
//        console.log(err, data);
//    });
//});
//var data = ss.parseTotal('20151201',
//    {"18":221572,"19":953,"20":107,"21":20800,"22":125065,"24":3136,"25":266,"30":1089,"32":1472,"33":492189,"34":40451,"35":9917,"36":4467,"38":3252,"39":33192,"40":27583,"41":120811,"42":8776,"43":1295,"44":31080,"46":188145,"47":1290,"49":30117,"50":1731233,"51":389057}
//    );
//console.log(data);
//ss.save(data, function(err, data){
//    console.log(err, data);
//});
