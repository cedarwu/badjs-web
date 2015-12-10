var LogService = require('../service/LogService');
var dateFormat = require('../utils/dateFormat');
var StatisticsServicePV = require('../service/StatisticsService_PV');
var TotalService = require('../service/projectTotalService2');

GLOBAL.pjconfig = {
    "mysql": {
        "url": "mysql://badjs:pass4badjs@10.198.30.62:4250/badjs"
    },
    "storage": {
        "errorMsgTopUrl": "http://10.185.14.28:9000/errorMsgTop",
        "errorMsgTopCacheUrl": "http://10.185.14.28:9000/errorMsgTopCache",
        "queryUrl": "http://10.185.14.28:9000/query",
        "queryCountUrl": "http://10.185.14.28:9000/queryCount",
        "querySvgUrl": "http://10.185.14.28:9000/errorCountSvg"
    },
    "acceptor": {
        "pushProjectUrl": "http://10.185.14.28:9001/getProjects"
    },
    "zmq": {
        "url": "tcp://10.185.14.28:10000",
        "subscribe": "badjs"
    },
    "email": {
        "homepage": "http://badjs.sng.local/user/index.html",
        "from": "badjs-vip@tencent.com",
        "emailSuffix": "@tencent.com",
        "time": "09:00:00",
        "top": 20,
        "module": "email_tof"
    },
    "postgreSql": {
        "connString": "postgres://tdw_v_zscai:234516038@pub-bi-tdw.oa.com:5432/sng_vas_speedtest_database"
    },
    "fileStorage": {
        "pageid": "./fileStorage/pageid.json",
        "threshold": "./fileStorage/threshold.json"
    }
};


var SSPV = new StatisticsServicePV();
//SSPV.countSave('20151201', function () {
//    console.log(arguments);
//});
//SSPV.getErrLogByDate(24, '20151202' , function(err, data){
//    var es = {};
//    if (data) {
//        console.log('拉取成功:'+ id);
//        es = SSPV.countError(data);
//    }
//    console.log(es);
//});
//SSPV.getErrLogLastHour(24, function (err, data) {
//    var es = {};
//    if (data) {
//        console.log('拉取成功:');
//        es = SSPV.countError(data);
//    }
//    console.log(data, es);
//});
var PTS = new TotalService();
PTS.fetchAndSave(new Date('2015-12-09 00:00:00'), function(err, data){
    console.log('total',err, data);
});
//PTS.processPV('20151209',function(err, data){
//    console.log('pv',err, data);
//});