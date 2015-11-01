/**
 * Created by chriscai on 2015/1/15.
 */


var BusinessService = require('../../service/BusinessService'),
    _ = require('underscore'),
    StatisticsService = require('../../service/StatisticsService'),
    compassService = require('../../service/compassService');

var log4js = require('log4js'),
    logger = log4js.getLogger();


function formateTime(time) {
    var DateObj = new Date(time),
        year = DateObj.getFullYear(),
        month = DateObj.getMonth() - -1,
        date = DateObj.getDate() - 0;
    return year + (month > 9 ? month + '': 0 + '' + month) + (date > 9 ? date + '' : 0 + '' + date);
}

var StatisticsAction = {


    index: function (param, req, res) {
        var params = req.query,
            user = req.session.user;

        var businessService = new BusinessService();

        businessService.findBusinessByUser(user.loginName, function (err, item) {
            res.render(param.tpl, {
                layout: false,
                user: user,
                index: 'statistics',
                statisticsTitle: param.statisticsTitle,
                items: item
            });
        });
    },
    projectTotal: function (param, req, res) {
        var params = req.query,
            user = req.session.user;

        var businessService = new BusinessService();

        businessService.findBusiness(function (err, items) {
            res.render(param.tpl, {
                layout: false,
                user: user,
                index: 'projectTotal',
                statisticsTitle: param.statisticsTitle,
                items: items
            });
        });

    },
    queryByChart: function (param, req, res) {
        var statisticsService = new StatisticsService();
        if (!param.projectId || isNaN(param.projectId) || !param.timeScope) {
            res.json({ret: 0, msg: 'success', data: {}});
            return;
        }
        statisticsService.queryByChart({
            projectId: param.projectId - 0,
            timeScope: param.timeScope - 0
        }, function (err, data) {
            if (err) {
                res.json({ret: -1, msg: "error"});
                return;
            }
            //var row = data.data;
            //compassService.query(function (err, result) {
            //    for (var l = row.length; l--;) {
            //        var ele = row[l];
            //        result.forEach(function (item) {
            //            if (ele.projectId == item.applyid && formateTime(ele.startDate) == item.ftime) {
            //                row[l]['pv'] = item.data_cnt;
            //                row[l]['rate'] = ((ele.total / item.data_cnt) * 100).toFixed(2) + '%';
            //            }
            //        });
            //    }
            //    data.data = row;
            //    res.json(data);
            //});
            //data.data = row;
            res.json(data);
        });
    },
    queryByChartForAdmin: function (param, req, res) {
        var statisticsService = new StatisticsService();
        if (!param.projectId || isNaN(param.projectId) || !param.timeScope || param.user.role != 1) {
            res.json({ret: 0, msg: 'success', data: {}});
            return;
        }

        statisticsService.queryByChart({
            projectId: param.projectId - 0,
            timeScope: param.timeScope - 0
        }, function (err, data) {
            if (err) {
                res.json({ret: -1, msg: "error"});
                return;
            }
            var row = data.data;
            logger.debug(row);
            compassService.query(function (err, result) {
                for (var l = row.length; l--;) {
                    var ele = row[l];
                    result.forEach(function (item) {
                        if (ele.projectId == item.applyid && formateTime(ele.startDate) == item.ftime) {
                            row[l]['pv'] = item.data_cnt;
                            row[l]['rate'] = ((ele.total / item.data_cnt) * 100).toFixed(2) + '%';
                        }
                    });
                }
                data.data = row;
                res.json(data);
            });
            /*compassService.query(function (err, result) {
             logger.info('callback is done');
             for (var l = row.length; l--;) {
             if (Array.isArray(row[l])) {
             for (var rowL = row[l]; rowL--;) {
             var ele = row[l][rowL];
             result.forEach(function (item) {
             logger.debug(ele.projectId);
             logger.debug(item.applyid);
             logger.debug(formateTime(ele.startDate));
             logger.debug(item.ftime);
             if (ele.projectId == item.applyid && formateTime(ele.startDate) == item.ftime) {
             row[l][rowL] = ele.total + '(' + (ele.total / item.data_cnt).toFixed(2) + ')';
             }
             });
             }
             }
             }
             logger.info('run to here');
             data.data = row;
             res.json(data);
             });*/
            //data.data = row;
            //res.json(data);
        });
    },
    queryById: function (param, req, res) {
        var statisticsService = new StatisticsService();
        if (!req.query.projectId || isNaN(req.query.projectId) || !req.query.startDate) {
            res.json({ret: 0, msg: 'success', data: {}});
            return;
        }
        statisticsService.queryById({
            projectId: req.query.projectId - 0,
            startDate: new Date(param.startDate - 0)
        }, function (err, data) {
            if (err) {
                res.json({ret: -1, msg: 'error', data: {}});
            } else {
                res.json({ret: 0, msg: 'success', data: data});
            }

        });
    }

};

module.exports = StatisticsAction;
