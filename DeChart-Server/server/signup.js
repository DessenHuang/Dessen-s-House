const dbserver = require('../dao/dbserver')

// 用户注册
exports.signUp = (req, res) => {
    let name = req.body.name
    let mail = req.body.mail
    let pwd = req.body.pwd
    // 写入数据库
    dbserver.createUser(name, mail, pwd, res)
}

// 用户邮箱是否已注册判断
exports.judgeValue = (req, res) => {
    let data = req.body.data
    let type = req.body.type

    // 写入数据库
    dbserver.countUserValue(data, type, res)
    
}