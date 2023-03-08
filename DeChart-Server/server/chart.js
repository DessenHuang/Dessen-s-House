const dbserver = require('../dao/dbserver')

// 获取一对一聊天消息
exports.msg = (req, res) => {
    let data = req.body
    dbserver.msg(data, res)
}

// 获取群聊天消息
exports.msgGroup = (req, res) => {
    let data = req.body
    dbserver.msgGroup(data, res)
}

// 新增一对一聊天消息
exports.insertMsg = (req, res) => {
    let uid = req.body.uid
    let fid = req.body.fid
    let msg = req.body.msg
    let type = req.body.type

    dbserver.insertMsg(uid, fid, msg, type, res)
}

// 新增群消息
exports.insertGroupMsg = (req, res) => {
    let uid = req.body.uid
    let gid = req.body.gid
    let type = req.body.type
    let msg = req.body.msg
    dbserver.insertGroupMsg(uid, gid, msg, type, res)
}