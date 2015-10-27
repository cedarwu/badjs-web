var tof = require('./oa/node-tof');
var crypto = require('crypto');
var log4js = require('log4js'),
    logger = log4js.getLogger();

var isError = function(res, error) {
    if (error) {
        res.json({
            ret: 1,
            msg: error
        });
        return true;
    }
    return false;
};

module.exports = function(req, res, next) {
    var params = req.query,
        user = req.session.user,
    //��ȡ�û�model
        userDao = req.models.userDao;

    req.indexUrl = req.protocol + "://" + req.get('host') + '/user/index.html';

    if (/^\/oalogin/i.test(req.url)) { // ��¼
        var redirectUrl = req.indexUrl;
        res.redirect('http://passport.oa.com/modules/passport/signin.ashx?url=' + redirectUrl);
        return;
    }
    if (params && params.ticket) { // oa ��¼��ת
        tof.passport(params.ticket, function(result) {
            if (result) {
                //��¼�ɹ�
                user = req.session.user = {
                    loginName: result.LoginName,
                    chineseName: result.ChineseName,
                    role: 0
                };

                userDao.one({
                    loginName: result.LoginName
                }, function(err, dbUser) {
                    if (isError(res, err)) {
                        return;
                    }

                    if (!dbUser) { //��һ�ε�½�����û���Ϣд�����ݿ�
                        req.session.user.email = user.loginName + GLOBAL.pjconfig.email.emailSuffix;
                        req.session.user.password = crypto.createHash("md5").update(user.loginName).digest('hex');

                        userDao.create(req.session.user, function(err, result) {
                            if (isError(res, err)) {
                                return;
                            }

                            req.session.user.role = result.role;
                            req.session.user.id = result.id;

                            logger.info("New User:" + JSON.stringify(req.session.user) + "insert into db-badjs");
                            next();
                        });
                    } else { // �Ѿ���¼�����ж��Ƿ������Ϣ
                        logger.info("Old User:" + JSON.stringify(req.session.user));
                        req.session.user.role = dbUser.role;
                        req.session.user.id = dbUser.id;
                        req.session.user.email = dbUser.email;

                        // ��δ��¼���� ������ӹ���������������
                        if (!dbUser.chineseName) {
                            dbUser.chineseName = result.ChineseName;
                            dbUser.save(function(err, result) {});
                        }
                        next();
                    }

                });

            } else {
                res.send(403, 'Sorry! you can not see that.');
            }
        });
    } else {
        next();
    }
};