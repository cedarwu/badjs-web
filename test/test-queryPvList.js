var http = require('http');

var options = {
    method: 'POST',
    hostname: 'cgi.lp.oa.com',
    path: '/glacier-query-new/cgi_server',
    port: 80
};


var errorType = {
    'ECONNRESET': 'socket超时'
};
var errorHandle = function (err, tips) {
    if (err.code && errorType[err.code]) {
        console.error((tips || '') + errorType[err.code]);
    } else {
        console.error((tips || '') + err.code);
    }
};

/**
 * 请求数据
 */
exports.request = function (options, callback) {
    if (typeof options != 'object') {
        console.error('缺少请求参数');
        return false;
    }
    callback = callback || (function () {
    });
    //初始化默认值
    options.timeout = options.timeout || 1000;

    //请求成功回调
    var cb = function (res) {
        console.log(res.statusCode);
        res.on('data', function (chunk) {
            console.log(chunk);
        });
    };

    //发送请求
    var req = http.request(options, cb);
    //请求错误处理
    req.on('error', function (err) {
        errorHandle(err, '连接' + options.hostname);
    });
    //设置超时
    req.setTimeout(options.timeout, function () {
        req.abort();
    });

};

exports.request(options, function(){});
