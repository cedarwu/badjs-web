var LogService = require('../service/LogService');

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
    "fileStorage":{
        "pageid":"./fileStorage/pageid.json",
        "threshold":"./fileStorage/threshold.json"
    }
};
var logService = new LogService();
var params = {
    id:24,
    startDate:1446446460000,
    endDate:1446457260000
};
logService.queryCount(params, function (err, items) {
    console.log(er, items);
});

