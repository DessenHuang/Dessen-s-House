const dbserver = require('../dao/dbserver')

// 建群
exports.createGroup = (req, res) => {
    let data = req.body
    dbserver.createGroup(data, res)
}

// 群详情
exports.groupDetail = (req, res) => {
    let gid = req.body.gid
    dbserver.groupDetail(gid, res)
}    

// 群详情修改
exports.groupUpdate = (req, res) => {
    let data = req.body
    dbserver.groupUpdate(data, res)
}

// 获取群成员
exports.getGroupUser = (req, res) => {
    let data = req.body
    dbserver.getGroupUser(data, res)
}

// 移出群聊
exports.moveGroupUser = (req, res) => {
    let data = req.body
    dbserver.moveGroupUser(data, res)
}

// 邀请入群
exports.applyMember = (req, res) => {
    let data = req.body
    dbserver.applyMember(data, res)
}

// 退出群聊
exports.getOutGroup = (req, res) => {
    let data = req.body
    dbserver.getOutGroup(data, res)
}

// 解散群
exports.dissolveGroup = (req, res) => {
    let gid = req.body.gid
    dbserver.dissolveGroup(gid, res)
}