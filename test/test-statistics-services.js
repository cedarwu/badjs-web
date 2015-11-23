var mysql = require('mysql'),
    StatisticsService = require('../service/StatisticsService'),
    orm = require('orm');

//GLOBAL.DEBUG = true;

var mysql ="mysql://badjs:pass4badjs@10.198.30.62:4250/badjs";
//var mysql = "mysql://badjs:pass4badjs@10.134.5.103:3306/badjs";
//var mysql = "mysql://root:root@localhost:3306/badjs";

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
orm.connect( mysql, function(err , db) {
    if(err){
        throw err;
    }

    global.models = {
        userDao : require('../dao/UserDao')(db),
        applyDao : require('../dao/ApplyDao')(db),
        approveDao : require('../dao/ApproveDao')(db),
        statisticsDao : require('../dao/StatisticsDao')(db),
        db : db
    }


    var aa = new StatisticsService();


    var startDate = new Date('2015-11-21 00:00:00');
    var nowDate = new Date;

    var fetch = function (id , startDate){
        aa.fetchAndSave(id , startDate , function (){
            console.log(startDate.toLocaleDateString() + " ok ");
            if((startDate -0) > (nowDate - 0) ){
                console.log("out today");
                return ;
            }
            //fetch(id , new Date(startDate.getFullYear() + "-" + (startDate.getMonth()+1)+"-"+ (startDate.getDate()+1)+" 00:00:00"));

        })
    }

    var list = [47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,30,29,28,27,26,25,24,22,21,20,19,18,51];
    var i=0, len=list.length;
    //for(i= 0,s=0; s<5 && list[i];i++,s++){
    //    fetch(list[i] , startDate);
    //}

    fetch(24, startDate);
    //setTimeout(function () {
    //    var thisFn = arguments.callee;
    //    if (list.length) {
    //        fetch(list.pop(), startDate);
    //        setTimeout(thisFn, 1000);
    //    }
    //}, 1000);

    //var timer = setInterval(function(){
    //    if(i < len){
    //        fetch(list[i++], startDate);
    //    }else{
    //        clearInterval(timer);
    //    }
    //},1000);
});





