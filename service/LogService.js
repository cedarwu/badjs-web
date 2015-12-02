/**
 * Created by chriscai on 2014/12/16.
 */

var http = require('http');

var log4js = require('log4js'),
    BusinessService = require('./BusinessService'),
    _ = require('underscore'),
    logger = log4js.getLogger();


var LogService = function () {

    /* if(GLOBAL.DEBUG){
     this.queryUrl = 'http://localhost:9000/query';
     }else {
     this.queryUrl = 'http://10.143.132.205:9000/query';
     this.pushProjectUrl = 'http://10.143.132.205:9001/getProjects';
     //}*/

    this.queryUrl = GLOBAL.pjconfig.storage.queryUrl;
    this.queryCountUrl = GLOBAL.pjconfig.storage.queryCountUrl;
    this.querySvgUrl = GLOBAL.pjconfig.storage.querySvgUrl;
    this.pushProjectUrl = GLOBAL.pjconfig.acceptor.pushProjectUrl;

    logger.debug('query url : ' + this.queryUrl)
//    this.url = 'http://127.0.0.1:9000/query';
}


LogService.prototype = {
    query: function (params, callback, type) {

        var strParams = '', queryUrl = '';
        for (var key in params) {
            if (key == 'index') {
                strParams += key + '=' + params[key] + '&';
            } else {
                strParams += key + '=' + JSON.stringify(params[key]) + '&';

            }
        }
        strParams += '_=1';
        logger.debug('query param : ' + strParams);
        switch (type) {
            case 'svg':
                queryUrl = this.querySvgUrl;
                break;
            case 'count' :
                queryUrl = this.queryCountUrl;
                break;
            default :
                queryUrl = this.queryUrl;
        }
        logger.info('the query url is '+queryUrl + '?' + strParams);
        http.get(queryUrl + '?' + strParams, function (res) {
            var buffer = '';
            res.on('data', function (chunk) {
                buffer += chunk.toString();
            }).on('end', function () {
                try {
                    if(global.debug){
		         logger.debug(buffer);
                    }
		    callback(null, JSON.parse(buffer))
                } catch (e) {
                    callback(e);
                }
            })

        }).on('error', function (err) {
            logger.warn('error :' + err);
            callback(err)
        })
    },
    queryCount: function (params, callback) {
        this.query(params, callback, 'count');
    },
    queryHistorySvg: function (params, callback) {
        this.query(params, callback, 'svg');
    },
    pushProject: function (callback) {
        var self = this;

        callback || (callback = function () {
        });

        var businessService = new BusinessService();

        var tryTimes = 0;
        var push = function () {

            businessService.findBusiness(function (err, item) {

                var strParams = '';

                _.each(item, function (value, ke) {
                    strParams += value.id + "_";
                });

                if (strParams.length > 0) {
                    strParams = "projectsId=" + strParams.substring(0, strParams.length - 1) + "&";
                }

                strParams += "auth=badjsAccepter";


                http.get(self.pushProjectUrl + '?' + strParams, function (res) {
                    res
                        .on('data', function () {
                        })
                        .on('end', function () {
                            callback();
                        })

                }).on('error', function (err) {
                    if (tryTimes <= 3) {
                        tryTimes++;
                        logger.warn('push project error and try:' + err);
                        push();
                    } else {
                        logger.warn('push project error :' + err);
                        callback(err)
                    }


                })
            });
        }

        push();

    }
}


module.exports = LogService;

