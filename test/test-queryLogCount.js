var LogService = require('../service/LogService');
var dateFormat = require('../utils/dateFormat');

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
var c = [ { count: 1, time: 1446446460000 },
    { count: 1, time: 1446446520000 },
    { count: 1, time: 1446446580000 },
    { count: 3, time: 1446446640000 },
    { count: 1, time: 1446446700000 },
    { count: 3, time: 1446446820000 },
    { count: 1, time: 1446446940000 },
    { count: 1, time: 1446447000000 },
    { count: 1, time: 1446447420000 },
    { count: 2, time: 1446447480000 },
    { count: 2, time: 1446447600000 },
    { count: 2, time: 1446447960000 },
    { count: 1, time: 1446448020000 },
    { count: 3, time: 1446448080000 },
    { count: 1, time: 1446448320000 },
    { count: 2, time: 1446448740000 },
    { count: 4, time: 1446448800000 },
    { count: 5, time: 1446449160000 },
    { count: 2, time: 1446449220000 },
    { count: 5, time: 1446449280000 },
    { count: 1, time: 1446449460000 },
    { count: 1, time: 1446449520000 },
    { count: 4, time: 1446449580000 },
    { count: 2, time: 1446449700000 },
    { count: 2, time: 1446449820000 },
    { count: 2, time: 1446449880000 },
    { count: 1, time: 1446449940000 },
    { count: 1, time: 1446450000000 },
    { count: 2, time: 1446450180000 },
    { count: 1, time: 1446450240000 },
    { count: 1, time: 1446450300000 },
    { count: 3, time: 1446450420000 },
    { count: 2, time: 1446450480000 },
    { count: 1, time: 1446450540000 },
    { count: 2, time: 1446450600000 },
    { count: 5, time: 1446450720000 },
    { count: 1, time: 1446450780000 },
    { count: 3, time: 1446450840000 },
    { count: 2, time: 1446451080000 },
    { count: 3, time: 1446451200000 },
    { count: 1, time: 1446451500000 },
    { count: 1, time: 1446451740000 },
    { count: 3, time: 1446451800000 },
    { count: 1, time: 1446452100000 },
    { count: 2, time: 1446452280000 },
    { count: 2, time: 1446452340000 },
    { count: 1, time: 1446452460000 },
    { count: 7, time: 1446452520000 },
    { count: 1, time: 1446452580000 },
    { count: 2, time: 1446452640000 },
    { count: 5, time: 1446452940000 },
    { count: 1, time: 1446453060000 },
    { count: 1, time: 1446453120000 },
    { count: 4, time: 1446453300000 },
    { count: 1, time: 1446453360000 },
    { count: 6, time: 1446453540000 },
    { count: 1, time: 1446453780000 },
    { count: 1, time: 1446454080000 },
    { count: 5, time: 1446454140000 },
    { count: 4, time: 1446454200000 },
    { count: 3, time: 1446454260000 },
    { count: 1, time: 1446454320000 },
    { count: 1, time: 1446454500000 },
    { count: 1, time: 1446454740000 },
    { count: 1, time: 1446454800000 },
    { count: 2, time: 1446454920000 },
    { count: 1, time: 1446455040000 },
    { count: 3, time: 1446455100000 },
    { count: 1, time: 1446455220000 },
    { count: 5, time: 1446455280000 },
    { count: 3, time: 1446455340000 },
    { count: 7, time: 1446455400000 },
    { count: 2, time: 1446455460000 },
    { count: 5, time: 1446455700000 },
    { count: 5, time: 1446455760000 },
    { count: 2, time: 1446455820000 },
    { count: 1, time: 1446455880000 },
    { count: 2, time: 1446455940000 },
    { count: 2, time: 1446456000000 },
    { count: 1, time: 1446456120000 },
    { count: 1, time: 1446456180000 },
    { count: 2, time: 1446456240000 },
    { count: 1, time: 1446456300000 },
    { count: 3, time: 1446456360000 },
    { count: 1, time: 1446456480000 },
    { count: 5, time: 1446456540000 },
    { count: 1, time: 1446456660000 },
    { count: 2, time: 1446456720000 },
    { count: 4, time: 1446456780000 },
    { count: 11, time: 1446456840000 },
    { count: 10, time: 1446456900000 },
    { count: 1, time: 1446457020000 },
    { count: 2, time: 1446457080000 },
    { count: 1, time: 1446457200000 } ];
//logService.queryCount(params, function (err, items) {
//    console.log(err, items);
//});

(c).forEach(function(item){
    console.log(dateFormat(new Date(item.time),'yyyyMMddhhmm'));
});