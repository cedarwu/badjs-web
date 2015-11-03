/**
 * 旁支统计
 * Created by donaldcen on 2015/11/03
 */
var SSPV = require('../../service/StatisticsService_PV');

var ErrorCount = {
    queryRealCount: function(params, req, res){
        res.jsonp({ret: 0, msg: 'success-query', data: params});
    }
};

module.exports = ErrorCount;