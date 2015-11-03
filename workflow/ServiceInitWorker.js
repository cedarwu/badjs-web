var log4js = require('log4js'),
    logger = log4js.getLogger();






module.exports = function (){
    setTimeout(function (){
        var service = require("../service/StatisticsService");
        logger.info('start Statistics  ...');
        new service().startMonitor();


        var LogService = require("../service/LogService");
        var logService = new LogService();
        var pushProject = function (){
            logService.pushProject(function (err){
                if(err){
                    logger.warn('push project on system start and error ' + err);
                }else {
                    logger.info('push project on system start');
                }

            });
        }

        pushProject();


        // 邮件报表
        var EmailService = require("../service/EmailService");
        logger.info('start email report ...');
        new EmailService().start();

        //错误率统计服务
        var ErrCountService = require("../service/StatisticsService_PV");
        var errCount = new ErrCountService();

        //pv同步服务
        var pvStorage = require("../service/PvService");
        logger.info('start pvStorage ...');
        pvStorage.start(function(){
            errCount.updateNow();
        });
    },3000)
}