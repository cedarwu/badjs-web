/**
 * pv统计service
 * Created by donaldcen on 2015/11/01
 * @constructor
 */

var pageConfig = require('../fileStorage/pageid.json');
var PvService = require('./PvService');
var dateFormat = require('../utils/dateFormat');
var LogService = require('../service/LogService');
var Omerge = require('../utils/objectMerge');
var FileStorage = require('./FileStorage');

/**
 * 转换pageMap
 * @param {json} pageconfig 页面id配置
 * @returns {{}}
 */
var page2Map = function (pageconfig) {
    var map = {};
    for (var i in pageconfig) {
        var pageid = i.replace(/-/g, '_');
        if (!map[pageconfig[i]]) {
            map[pageconfig[i]] = [];
        }
        if (!(i in map[pageconfig[i]])) {
            map[pageconfig[i]].push(pageid);
        }
    }
    return map;
};

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


function StatisticsServicePV() {
    this.pageMap = page2Map(pageConfig);
    this.pvService = PvService.getServices()[0] || PvService.create();
    this.options = {
        filePath: __dirname + '/../fileStorage/count_{date}'
    };
    this.files = {};
    //this.pvService.getByDate('20151101', function(err, data){
    //    console.log(err, data);
    //});
}

StatisticsServicePV.prototype = {
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
            this.files[dateStr] = new FileStorage(opt.filePath.replace(/\{date\}/g, dateStr), function (err, fileStorage) {
                callback(err, fileStorage);
            }, false);
        }
    },
    /**
     * 存入统计数据
     * @param {String} dateStr 日期时间戳(20151011)
     * @param {Object} data 存入内容
     * @param {Function} callback
     */
    save: function (dateStr, data, callback) {
        var me = this;
        me.openFile(dateStr, function (err, fileStorage) {
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
     * 取一天中每一份的错误量
     * @param {String} appid
     * @param {String} dateStr
     * @param {Function} callback
     */
    getErrLogByDate: function (appid, dateStr, callback) {
        var start = Number(string2Date(dateStr, 'yyyyMMdd'));
        var end = start + 1000 * 60 * 60 * 24;
        this.getErrLog(appid, start - 1000 * 60 * 10, end, callback);//多取前面10分钟和pv对齐
    },

    /**
     * 获取区间内每分钟错误
     * @param {String} appid 项目id
     * @param {Number} start 开始时间
     * @param {Number} end 结束时间
     * @param {Function} callback 回调
     */
    getErrLog: function (appid, start, end, callback) {
        var logService = new LogService();
        var params = {
            id: appid,
            startDate: start,
            endDate: end
        };
        logService.queryCount(params, function (err, items) {
            if (err) {
                logger.error('SPV：拉取错误失败' + err);
            }
            callback(err, items);
        });
    },

    /**
     * 获取数据统计并保存
     * @param dateStr
     * @param callback
     */
    countSave: function (dateStr, callback) {
        var me = this;
        me.getEP(dateStr, function(err, data){
            if(data){
                me.save(dateStr, data, function(err, data){
                    callback(err, data);
                });
            }
        });
    },

    /**
     * 获取对应天的错误和pv
     * @param {String} dateStr 日期戳
     * @param {Function} callback
     */
    getEP: function (dateStr, callback) {
        var me = this;
        var ep = {};
        var cblen = 0;
        var errs = [];
        var cb = function () {
            cblen--;
            if (cblen == 0) {
                (errs.length == 0) && (errs = null);
                callback(errs, ep);
            }
        };
        //拉取错误数据；
        for (var appid in this.pageMap) {
            cblen++;
            (function (id) {
                me.getErrLogByDate(id, dateStr, function (err, data) {
                    if(data){
                        (!ep[id]) && (ep[id] = {});
                        ep[id] = Omerge(ep[id], me.countError(data));
                    }
                    cb();
                });
            })(appid);
        }
        //拉取pv数据
        cblen++;
        me.pvService.getByDate(dateStr, function(err, data){
            for(var appid in me.pageMap){
                var pvs = [];
                (me.pageMap[appid] || []).forEach(function(pageid){
                    if(data[pageid]){
                        pvs.push(data[pageid]);
                    }
                });
                ep[appid] = Omerge(ep[appid], me.countPv(dateStr, pvs));
            }
            cb();
        });
    },



    /**
     * 统计每10分钟的错误
     * @param elog
     * @returns {{}}
     */
    countError: function (elog) {
        var all = {};
        var detaT = 1000 * 60 * 10; //每10分钟的毫秒数
        (elog || []).forEach(function (item) {
            var t10 = (parseInt(item.time / detaT) + 1) * detaT; //由于pv是后收集加到下一个10分，时间轴后移
            if (!all[t10]) {
                all[t10] = {count: Number(item.count)};
            } else {
                all[t10].count += Number(item.count);
            }
        });
        return all;
    },

    /**
     * 统计pv
     * @param {String} dateStr
     * @param {Array} pvs
     * @returns {{}}
     */
    countPv: function (dateStr, pvs) {
        var all = {};
        (pvs || []).forEach(function (pv) {
            for (var date in pv) {
                var time = Number(string2Date(dateStr + date, 'yyyyMMddhhmm'));
                if (!all[time]) {
                    all[time] = {pv: Number(pv[date]) || 0};
                } else {
                    all[time].pv += Number(pv[date]);
                }
            }
        });
        return all;
    },

    query: function (appid, callback) {

    }
};

module.exports = StatisticsServicePV;

var s = new StatisticsServicePV();
s.countSave('20151103', function(err, data){
    console.log('计算pv',err , data);
});