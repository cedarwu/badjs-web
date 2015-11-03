/**
 * Create by donaldcen on 2015/11/03
 * 合并对象
 * @param {Object} dest 目标对象
 * @param {Object} score 来源对象
 * @returns {*} dest 合并后的对象
 */
var updateO = function (dest, score) {
    if (typeof score !== 'object') {
        return dest;
    }
    if (!dest) {
        dest = {};
    }
    for (var i in score) {
        if (typeof score[i] === 'object' && typeof dest[i] === 'object') {
            arguments.callee(dest[i], score[i]);
        } else {
            dest[i] = score[i];
        }
    }
    return dest;
};

module.exports = updateO;