const dbserver = require('../dao/dbserver')

// 用户详情
exports.userDetail = (req, res) => {
    let id = req.body.id
    dbserver.userDetail(id, res)
}

// 用户信息修改
exports.userUpdate = (req, res) => {
    let data = req.body
    dbserver.userUpdate(data, res)
}