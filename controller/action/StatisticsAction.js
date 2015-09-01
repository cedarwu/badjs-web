/**
 * Created by chriscai on 2015/1/15.
 */


var BusinessService = require('../../service/BusinessService'),
    _ = require('underscore'),
    StatisticsService = require('../../service/StatisticsService'),
    compassService = require('../../service/CompassService');

var  log4js = require('log4js'),
    logger = log4js.getLogger();

var StatisticsAction = {


    index :  function(param, req, res){
        var params = req.query,
            user  = req.session.user;

        var businessService =  new BusinessService();

        businessService.findBusinessByUser(user.loginName , function (err, item){
            res.render(param.tpl, { layout: false, user: user, index:'statistics' , statisticsTitle:param.statisticsTitle,  items : item});
        });
    },
    projectTotal :  function(param, req, res){
        var params = req.query,
            user  = req.session.user;

        var businessService =  new BusinessService();

        businessService.findBusiness(function(err, items){
            res.render(param.tpl, { layout: false, user: user, index:'projectTotal' , statisticsTitle:param.statisticsTitle,  items : items});
        });

    },
    queryByChart : function (param, req, res) {
        var statisticsService =  new StatisticsService();
        if(!param.projectId || isNaN(param.projectId) || !param.timeScope){
            res.json({ret:0 , msg:'success' , data : {} });
            return ;
        }
        statisticsService.queryByChart({projectId : param.projectId-0 , timeScope:param.timeScope-0 }  , function (err, data){
            console.log(data);
            if(err){
                res.json({ret:-1, msg:"error"});
                return;
            }
            data.data.forEach(function(ele,index){
                if(Array.isArray(ele)){
                    ele.forEach(function(ele,index){
                        compassService.query(Date.parse(ele.startDate),Date.parse(ele.endDate),ele.protectid,function(pv){
                            ele.total = ele.total+'('+(total/pv).toFixed(2)+')';
                        });
                    })
                }
            });
            res.json(data);
        });
    },
    queryByChartForAdmin : function (param, req, res) {
        var statisticsService =  new StatisticsService();
        if(!param.projectId || isNaN(param.projectId) || !param.timeScope || param.user.role !=1 ){
            res.json({ret:0 , msg:'success' , data : {} });
            return ;
        }

        statisticsService.queryByChart({  projectId : param.projectId-0 , timeScope:param.timeScope-0}  , function (err, data){
            data.data.forEach(function(ele,index){
                if(Array.isArray(ele)){
                    ele.forEach(function(ele,index){
                        compassService.query(Date.parse(ele.startDate),Date.parse(ele.endDate),ele.protectid,function(pv){
                            ele.total = ele.total+'('+(total/pv).toFixed(2)+')';
                        });
                    })
                }
            });
            if(err){
                res.json({ret:-1, msg:"error"});
                return;
            }
            res.json(data);
            return;
        });
    },
    queryById:function (param , req, res ){
        var statisticsService =  new StatisticsService();
        if(!req.query.projectId || isNaN(req.query.projectId) || !req.query.startDate){
            res.json({ret:0 , msg:'success' , data : {} });
            return ;
        }
        statisticsService.queryById({projectId : req.query.projectId-0 , startDate : new Date(param.startDate - 0 ) }  , function (err, data){
            if(err){
                res.json({ret:-1 , msg:'error' , data : {} });
            }else {
                res.json({ret:0 , msg:'success' , data : data });
            }

        });
    }

};

module.exports = StatisticsAction;