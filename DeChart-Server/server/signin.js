const dbserver = require('../dao/dbserver')

// 用户登陆
exports.signIn = (req, res) => {
    let data = req.body.data
    let pwd = req.body.pwd

    dbserver.userMatch(data, pwd, res)
}