/**
 * 文件storage服务
 * Created by donaldcen on 2015/10/31.
 */
var fs = require('fs');
var log4js = require('log4js'),
    logger = log4js.getLogger();
var updateO = require('../utils/objectMerge');


/**
 * 文件存储
 * @param {String} filePath 文件路径
 * @param {Function} callback 初始化完成回调
 * @param {Boolean} useCache 是否使用内存缓存文件内容
 * @constructor
 */
function FileStorage(filePath, callback, useCache) {
    this.filePath = filePath;
    this.useCache = useCache || false;
    this.cache = {};
    this.init(callback);
}

FileStorage.prototype = {
    init: function (callback) {
        callback = callback || (function(){});
        var me = this;
        fs.exists(this.filePath, function (exists) {
            if (!exists) {
                console.log('no File:',me.filePath,__filename,__dirname);
                me.write(me.cache, function (err, data) {
                    callback(err, me);
                });
            } else {
                if (me.useCache) {
                    me.read(function (err, data) {
                        if (!err) {
                            me.cache = data;
                        }
                        callback(err, me);
                    });
                } else {
                    callback(null, me);
                }
            }
        });
    },
    /**
     * 从文件读取数据
     * @param {Function} callback 回调
     */
    read: function (callback) {
        var me = this;
        var filePath = this.filePath;
        if (this.useCache && this.cache) {
            callback(null, this.cache);
        } else {
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    try {
                        //更新cache
                        if (me.useCache) {
                            me.cache = data;
                        }
                        callback(null, JSON.parse(data));
                    } catch (e) {
                        console.error(e.message, e.stack);
                        callback(e.message);
                    }
                }
            });
        }
    },
    /**
     * 写入文件
     * @param {String} fileName
     * @param {Object} data
     * @param {Function} callback 写入回调
     */
    write: function (data, callback) {
        var me = this;
        var filePath = this.filePath;
        fs.writeFile(filePath, JSON.stringify(data), function (err) {
            if (err) {
                console.error(err);
            } else {
                //更新缓存
                if (me.useCache) {
                    me.cache = data;
                }
                callback(null, data);
            }
        });
    },
    /**
     * 更新文件数据
     * @param {Object} data 合入对象
     * @param {Functoin} callback 回调
     */
    update: function (data, callback) {
        var me = this;
        this.read(function (err, rd) {
            if (err) {
                callback(err);
            } else {
                rd = updateO(rd, data);
                me.write(rd, callback);
            }
        });
    }
};


module.exports = FileStorage;
////var a;
//var a = {a:1, b:[1,2,3], c:'a', e:{aa:1,bb:{cc:1}}};
////var b = {a:2, b:[], d: {aa: 1, bb: 2}, e:{aa:2,bb:{cc:{a:1}}}};
//var b;
////console.log('-------->',JSON.stringify(updateO(a,b)));
//console.log(updateO(a,b));
//console.log(a);

//
//var fsg = new FileStorage('../fileStorage/20151010', function(){
//    fsg.update({b: {a: 1, b: 2}}, function (err, data) {
//        console.log(err, data);
//    });
//}, false);
