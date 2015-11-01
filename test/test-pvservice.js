var PvService = require('../service/PvService');
var FileStorage = require('../service/FileStorage');
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

//pvService.updatePVNow();

console.log(path.resolve(__dirname,'../fileStorage/'));