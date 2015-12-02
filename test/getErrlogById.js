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
var PvService = require('../service/PvService');
var path = require('path');
var StatisticsServicePV = require('../service/StatisticsService_PV');


var SSPV = new StatisticsServicePV();
//appid, dateStr, callback
SSPV.getErrLogByDate(24, '20151202', function (err, data) {
    console.log(err, data);
});