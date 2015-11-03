var PvService = require('../service/PvService');
var path = require('path');

var pvService = PvService.create({
    filePath: '../fileStorage/',
    filePrefix: 'pv_',
    fileSuffix: ''
});

//PvService.getPVByDate('201510302220', function (err, data) {
//    pvService.save(data, function (err, data) {
//        console.log(err, data);
//    });
//});
//跑一个页面的多天数据(一次最多20小时)
PvService.getPVByPageid('169_2122_1', '201510312200' , '201511021000', function (err, data) {
    console.log('数据回来', err, data);
    pvService.save(data, function (err, data) {
        console.log(err, data);
    });
});

//pvService.updatePVNow();

//console.log(path.resolve(__dirname,'../fileStorage/'));