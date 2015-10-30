var http = require('http');

var options = {
    method: 'POST',
    hostname: 'cgi.lp.oa.com',
    path: '/glacier-query-new/cgi_server',
    port: 80
};


var errorType = {
    'ECONNRESET': 'socket��ʱ'
};
var errorHandle = function (err, tips) {
    if (err.code && errorType[err.code]) {
        console.error((tips || '') + errorType[err.code]);
    } else {
        console.error((tips || '') + err.code);
    }
};

/**
 * ��������
 */
exports.request = function (options, callback) {
    if (typeof options != 'object') {
        console.error('ȱ���������');
        return false;
    }
    callback = callback || (function () {
    });
    //��ʼ��Ĭ��ֵ
    options.timeout = options.timeout || 1000;

    //����ɹ��ص�
    var cb = function (res) {
        console.log(res.statusCode);
        res.on('data', function (chunk) {
            console.log(chunk);
        });
    };

    //��������
    var req = http.request(options, cb);
    //���������
    req.on('error', function (err) {
        errorHandle(err, '����' + options.hostname);
    });
    //���ó�ʱ
    req.setTimeout(options.timeout, function () {
        req.abort();
    });

};

exports.request(options, function(){});
