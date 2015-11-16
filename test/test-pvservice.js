var PvService = require('../service/PvService');
var path = require('path');
var StatisticsServicePV = require('../service/StatisticsService_PV');
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
var pvService = PvService.create({
    filePath: '../fileStorage/',
    filePrefix: 'pv_',
    fileSuffix: ''
});

var SSPV = new StatisticsServicePV();
SSPV.getEP('20151116', function (err, data) {
    console.log(err,'done');
});

//PvService.getPVByDate('201510302220', function (err, data) {
//    pvService.save(data, function (err, data) {
//        console.log(err, data);
//    });
//});
//跑一个页面的多天数据(一次最多20小时)
//PvService.getPVByPageid('169_2122_1', '201510312200' , '201511021000', function (err, data) {
//    console.log('数据回来', err, data);
//    pvService.save(data, function (err, data) {
//        console.log(err, data);
//    });
//});

//pvService.updatePVNow();

//console.log(path.resolve(__dirname,'../fileStorage/'));