/**
 * @info : LOG ACION
 * @author : coverguo
 * @date : 2014-12-16
 */

var LogService = require('../../service/LogService'),
    log4js = require('log4js'),
    http = require('http'),
    logger = log4js.getLogger(),
    isError = function (res, error) {
        if (error) {
            res.json({ret: 1, msg: error});
            return true;
        }
        return false;
    };
var formatArray = function (items, timePeriod, startDate, endDate, isNotWithTime) {
    var resultArr = [];
    var timeCount = Math.ceil((endDate - startDate) / timePeriod);
    while (timeCount) {
        var tag = startDate + timeCount * timePeriod;
        var returnObj = {};
        returnObj.time = tag;
        returnObj.count = 0;
        while (items.length) {
            var data = items.pop();
            logger.debug('tag is ' + tag);
            logger.debug('timePeriod is ' + timePeriod);
            logger.debug(tag - data.time);
            if (tag - data.time <= timePeriod && tag - data.time >= 0) {
                returnObj.count += parseInt(data.count);
                logger.debug('the match count is ' + returnObj.count);
            } else {
                if (startDate <= data.time && data.time <= endDate) {
                    items.push(data);
                    break;
                }
            }
        }
        if (isNotWithTime) {
            logger.debug('the catch count is ' + returnObj.count);
            resultArr.push(returnObj.count);
        } else {
            resultArr.push(returnObj);
        }
        timeCount--;
    }
    return resultArr.reverse();
}
/**
 * 错误量查询
 * @type {{queryLogList: Function, queryLogCountOnly: Function, querySvgCount: Function, queryLogCount: Function, code: Function}}
 */
var LogAction = {
    queryLogList: function (params, req, res) {

        var logService = new LogService();

        params['endDate'] -= 0;
        params['startDate'] -= 0;
        params['id'] -= 0;
        delete params.user;
        logService.query(params, function (err, items) {
            if (isError(res, err)) {
                logger.error('LogAction.queryLogList:'+JSON.stringify(params)+',[error]:'+err);
                return;
            }
            ;

            res.json({ret: 0, msg: "success-query", data: items});
        });
    },
    queryLogCountOnly: function (params, req, res) {
        var logService = new LogService(),
            endDate = params['endDate'] -= 0,
            startDate = params['startDate'] -= 0,
            timePeriod = (parseInt(params['timePeriod']) || 1) * 60000,
            resObj = {ret: 0, msg: "success-query"},
            history = params['history'] || 0;
        params['id'] -= 0;
        params['level'] = params['level'] || ['4'];
        delete params.user;
        //formate time
        endDate = new Date(endDate);
        endDate = Date.parse(endDate.getFullYear() + '-' + (endDate.getMonth() - -1) + '-' + endDate.getDate() + ' ' + endDate.getHours() + ':' + endDate.getMinutes());
        startDate = new Date(startDate);
        startDate = Date.parse(startDate.getFullYear() + '-' + (startDate.getMonth() - -1) + '-' + startDate.getDate() + ' ' + startDate.getHours() + ':' + startDate.getMinutes());
        //add time check
        if (startDate > endDate) {
            res.jsonp({'message': 'error,endDate shuould > startDate'});
            return;
        }
        logService.queryCount(params, function (err, items) {
            if (isError(res, err)) {
                return;
            }
            resObj.data = formatArray(items, timePeriod, startDate, endDate, false) || [];
            if (history) {
                var oneDay = 24 * 60 * 60 * 1000,
                    historyEnd = params['endDate'] = params['endDate'] - oneDay,
                    historyStart = params['startDate'] = params['startDate'] - oneDay;
                logService.queryCount(params, function (err, hisitems) {
                    if (isError(res, err)) {
                        return;
                    }
                    resObj.history = formatArray(hisitems, timePeriod, historyStart, historyEnd, false) || [];
                    logger.info('web query end' + Date.now());
                    res.jsonp(resObj);
                });

            } else {
                logger.info('web query end' + Date.now());
                res.jsonp(resObj);
            }
        });
    },
    querySvgCount: function (params, req, res) {
        var logService = new LogService(),
            endDate = params['endDate'] -= 0,
            startDate = params['startDate'] -= 0,
            timePeriod = (params['timePeriod'] || 1) * 60000,
            resObj = {ret: 0, msg: "success-query"},
            history = params['history'] || 0,
            isNotWithTime = params['withTime'] || false;
        params['id'] -= 0;
        params['level'] = params['level'] || ['4'];
        delete params.user;
        logService.queryHistorySvg(params, function (err, svgitems) {
            if (isError(res, err)) {
                return;
            }
            logger.debug(svgitems);
            resObj.svg = formatArray(svgitems, timePeriod, startDate, endDate, isNotWithTime) || [];
            logger.info('web query end' + Date.now());
            res.jsonp(resObj);
        })
    },
    queryLogCount: function (params, req, res) {
        var logService = new LogService(),
            errorObj = {}, resArr = [],
            endDate = params['endDate'] -= 0,
            startDate = params['startDate'] -= 0,
            contentVisable = params['content'] || false;
        params['id'] -= 0;
        params['level'] = ['4'];
        delete params.user;
        var timePeriod = (params['timePeriod'] || 1) * 60000;
        logService.query(params, function (err, items) {
            if (isError(res, err)) {
                return;
            }
            var timeCount = Math.ceil((endDate - startDate) / timePeriod);
            items.forEach(function (ele) {
                var date = Date.parse(ele.date);
                for (var i = 0; i <= timeCount; i++) {
                    var tag = startDate + i * timePeriod;
                    errorObj[tag] = Array.isArray(errorObj[tag]) ? errorObj[tag] : [];
                    if (date > tag && date < startDate + (i + 1) * timePeriod) {
                        errorObj[tag].push(ele);
                    }
                }
            });
            for (var key in errorObj) {
                if (contentVisable) {
                    errorObj[key] = errorObj[key];
                } else {
                    var item = {
                        time: key,
                        errorCount: errorObj[key].length
                    };
                    resArr.push(item);
                }
            }
            var resData = contentVisable ? errorObj : resArr;
            res.jsonp({ret: 0, msg: 'success-query', data: resData});
        });
    },
    code: function (params, req, res) {
        http.get(params.target, function (response) {
            var buffer = '';
            response.on('data', function (chunk) {
                buffer += chunk.toString();
            }).on('end', function () {
                res.json({ret: 0, msg: "success-query", data: buffer});
            });
        })
    }
};

module.exports = LogAction;

