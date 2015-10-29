var pg = require('pg'),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    fs = require('fs');

var connString = 'postgres://tdw_v_zscai:234516038@pub-bi-tdw.oa.com:5432/sng_vas_speedtest_database',
    filePath = '../fileStorage/appid.json';

//cache
var postgreSql,
    Done,
    Result;

pg.connect(connString, function (err, client, done) {
    if (err) {
        logger.warn('client err,the err is ' + err);
    }
    postgreSql = client;
    Done = done;
});

function formateTime(time) {
    var DateObj = new Date(time),
        year = DateObj.getFullYear(),
        month = DateObj.getMonth() - -1,
        date = DateObj.getDate() - 0;
    return year + (month > 9 ? month + '': 0 + '' + month) + (date > 9 ? date + '': 0 + '' + date);
}

function getformateTime() {
    var dayObj = new Date(),
        dayTime = 1000 * 60 * 60 * 24,
        today = Date.parse(dayObj.getFullYear() + '-' + (dayObj.getMonth() - -1) + '-' + (dayObj.getDate() - 1)),
        timeString = '';
    for (var i = 7; i--;) {
        timeString += '' + formateTime(today - i * dayTime);
        if (i != 0) {
            timeString += ',';
        }
    }
    return timeString;
}

/**
 * 通过postgresql来查询上报总数（pv）
 * @param startTime (long)
 * @param endTime (long)
 * @param callback (function)
 */
function queryPvList(callback) {
    var timeString = getformateTime();
    var sql = "select owner,ftime,data_cnt,concat(buzid,'-',siteid,'-',pageid) as pageid from( " +
        "select " +
        "ftime, " +
        "- 999998 as develop_center," +
        "page_name, " +
        "owner, " +
        "platform_name, " +
        "network, " +
        "version_name, " +
        "sum(data_cnt) as data_cnt, " +
        "sum(dt_client) as dt_client, " +
        "sum(dt_network) as dt_network, " +
        "sum(dt_page) as dt_page, " +
        "sum(dt_net_page) as dt_net_page," +
        "sum(dt_total) as dt_total, " +
        "sum(dt_webview) as dt_webview," +
        "sum(dt_url) as dt_url, " +
        "sum(dt_domready) as dt_domready, " +
        "sum(dt_activity) as dt_activity, " +
        "iswebcache, " +
        "is_offline, " +
        "ispreloadwebprocess, " +
        "is_key_page, " +
        "sum(pageid) as pageid, " +
        "sum(siteid) as siteid,"+
        "sum(buzid) as buzid,"+
        "- 600034 as product_id " +
        "from ( " +
        "SELECT " +
        "ftime, " +
        "develop_center, " +
        "buzid, " +
        "siteid, " +
        "pageid," +
        "page_name," +
        "owner," +
        "is_key_page," +
        "platform_name," +
        "network," +
        "version_name," +
        "dt_client," +
        "dt_network," +
        "dt_page," +
        "dt_net_page," +
        "dt_total," +
        "dt_webview," +
        "dt_url," +
        "dt_domready," +
        "dt_activity," +
        "data_cnt," +
        "is_offline," +
        "ispreloadwebprocess," +
        "iswebcache " +
        "FROM (" +
        "SELECT " +
        "ftime," +
        "buzid, " +
        "siteid," +
        "pageid, " +
        "concat(buzid, '_', siteid, '_', pageid) as pagename," +
        "platform_name, " +
        "case when net_type = '-1000000' then '全网络' " +
        "when net_type = '2g' then '2g' " +
        "when net_type = '3g' then '3g' " +
        "when net_type = '4g' then '4g' " +
        "when net_type = 'wifi' then 'wifi' " +
        "else '-911' end as network," +
        "version_name, " +
        "isoffline as is_offline, " +
        "ispreload as ispreloadwebprocess, " +
        "iswebcache as iswebcache, " +
        "(loadurl_sum - clickstart_sum)/ data_cnt as dt_client, " +
        "(head_sum - loadurl_sum)/ data_cnt as dt_network, " +
        "(active_sum - head_sum)/ data_cnt as dt_page, " +
        "(active_sum - loadurl_sum)/ data_cnt as dt_net_page," +
        "(active_sum - clickstart_sum)/ data_cnt as dt_total, " +
        "(webviewstart_sum - clickstart_sum )/ data_cnt as dt_webview, " +
        "(loadurl_sum - webviewstart_sum)/ data_cnt as dt_url, " +
        "(domready_sum - head_sum)/ data_cnt as dt_domready, " +
        "(active_sum - domready_sum)/ data_cnt as dt_activity, " +
        "data_cnt as data_cnt " +
        "FROM " +
        " public.r_zscai_sng_network_speed_time  " +
        "where data_cnt > 100" +
        " and buzid > 0 and siteid > 0 and pageid > 0 )" +
        " t1 LEFT JOIN public.r_haozhengwu_sng_page_info t2 ON t1.pagename = t2.page_key ) ElmData" +
        " where " +
        "ftime in(" + timeString + ") " +
        "and platform_name =- 1000000 " +
        "and network = '全网络' and version_name = '-1000000' " +
        "and iswebcache = '-1000000' " +
        "and is_offline = '-1000000' " +
        "and ispreloadwebprocess = '-1000000' " +
        "and is_key_page = '1' " +
        "group by " +
        "ftime," +
        "page_name," +
        "owner," +
        "platform_name," +
        "network," +
        "version_name," +
        "iswebcache," +
        "is_offline," +
        "ispreloadwebprocess," +
        "is_key_page order by ftime desc nulls last," +
        "dt_total desc nulls last ) " +
        "as tmpElmData ";
    console.log(sql);
    postgreSql.query(sql, function (err, result) {
        Done();
        if (err) {
            logger.warn('query has some err,err is :' + err);
            typeof callback == 'function' && callback(err);
        }
        typeof callback == 'function' && callback(null, result);
    });
}
/**
 * 将appid转换成pageid
 * @param appid
 */

function turn2pageId(appid) {
    try {
        var data = JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        if (err) {
            logger.warn('file read err ,the err is' + err);
            return;
        }
    }
    return data[appid];
    //fs.readFile(filePath,function(err,data){
    //    if(err){
    //        logger.warn('file read err ,the err is'+ err);
    //        return;
    //    }
    //    var data = JSON.parse(data);
    //    return data[appid];
    //});
}

/**
 * 将pageid和appid成对的以json的格式存入到指定的文件中去。
 * @param appid
 * @param pageid
 */
function writePageid(appid, pageid, callback) {
    var Data = {};
    fs.readFile(filePath, function (err, data) {
        if (err) {
            logger.warn('file read is wrong ,the err is ' + err);
            return;
        }
        if (data) {
            Data = JSON.parse(data);
        }
        Data[appid] = pageid;
        fs.writeFile(filePath, JSON.stringify(Data), function (err) {
            if (err) {
                logger.warn('write file is wrong the err is' + err);
            }
            typeof callback == 'function' && callback(err);
        });
    });
}

/**
 * 查询pv
 * @param startTime
 * @param endTime
 * @param appid
 * @param callback
 */
function queryPv(startTime, endTime, appid, callback) {
    var Pv,
        pageid = turn2pageId(appid);
    queryPvList(startTime, endTime, function (err, result) {
        if (err) {
            typeof callback == 'function' && callback(err);
        }
        var data = result.rows.length != 0 ? result.rows : [];
        if (data.length) {
            data.map(function (ele, index) {
                if (ele.pageid = pageid) {
                    Pv = ele.data_cnt;
                }
            })
        } else {
            logger.warn('the length of pv result is wrong get 0');
        }
        typeof callback == 'function' && callback(null, Pv);
    })
}

function httpQuery(param, callback) {
    var startTime = Date.parse(param.startDate),
        endTime = Date.parse(param.endDate),
        appid = parseInt(param.appid);
    if (startTime && endTime && appid) {
        queryPvList(startTime, endTime, appid, function (err, result) {
            if (err) {
                callback && callback(err);
            }
            callback && callback(null, result)
        })
    } else {
        callback && callback({err: 'params error'});
    }
}
//setTimeout(function(){
//    queryPvList(function(err,result){
//        console.log(result);
//    })},1000);

setTimeout(function(){
    queryPvbymin(function(err,result){
        console.log(result);
    });
},1000);

/**
 * 通过postgresql来查询全量上报（pv）分时段
 * @param startTime (long)
 * @param endTime (long)
 * @param callback (function)
 */
function queryPvbymin(callback) {
    var sql = '{"\
    "ftime": {\
        "range": "201510290000,201510292130"\
    },\
    "measList": ["cnt",\
        "time_point_1",\
        "time_point_2",\
        "time_point_3",\
        "time_point_4",\
        "time_point_5"],\
        "dimList": ["_10minute",\
        "page",\
        "net_type",\
        "is_offline",\
        "sq_ver",\
        "plat"],\
        "condition": {\
        "page": {\
            "in": "169_2122_1"\
        }\
    },\
    "group": ["ftime",\
        "_10minute"],\
        "limit": "0,3000",\
        "query_from": 0,\
        "query_id": "56321fad117b8",\
        "report_id": "514451"\
}"';
    console.log(sql);
    postgreSql.query(sql, function (err, result) {
        Done();
        if (err) {
            logger.warn('query has some err,err is :' + err);
            typeof callback == 'function' && callback(err);
        }
        typeof callback == 'function' && callback(null, result);
    });
}