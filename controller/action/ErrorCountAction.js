/**
 * 旁支统计
 * Created by donaldcen on 2015/11/03
 */
var SSPV = require('../../service/StatisticsService_PV');
var PTS = require('../../service/projectTotalService');
var dateFormat = require('../../utils/dateFormat');

var ErrorCount = {
    queryRealCount: function(params, req, res){
        var now = dateFormat(new Date(),'yyyyMMdd');
        if(!params.id || !params.date){
            res.jsonp({ret: -1, msg: 'query params error', data: null});
            return;
        }
        if(params.date > now){
            res.jsonp({ret: -2, msg: 'query date later', data: null});
            return;
        }
        var sspv = new SSPV();
        var ids = params.id.toString().split(',');
        sspv.queryByDay(ids, params.date, function(err, data){
            if(err){
                res.jsonp({ret: -2, msg: err, data: null});
            }else{
                res.jsonp({ret: 0, msg: 'success-query', data: data});
            }
        });

    },

    queryProjectTotal: function(params, req, res){
        if(!params.id){
            res.jsonp({ret: -1, msg: 'query params error', data: null});
            return;
        }
        var pts = new PTS();
        var ids = params.id.toString().split(',');
        var timeScope = (params.timeScope && (params.timeScope|0)) || 5;
        pts.queryByDays(ids, timeScope, function(err, data){
            if(err){
                res.jsonp({ret: -2, msg: err, data: null});
            }else{
                res.jsonp({ret: 0, msg: 'success-query', data: data});
            }
        });

    }
};

module.exports = ErrorCount;