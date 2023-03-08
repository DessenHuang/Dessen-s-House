const dbserver = require('../dao/dbserver')

// 获取好友列表
exports.getFriend = (req, res) => {
    let data = req.body
    dbserver.getUsers(data, res)
}

// 获取最后一条消息
exports.getLastMsg = (req, res) => {
    let data = req.body
    dbserver.getOneMsg(data, res)
}

// 汇总未读消息数
exports.unreadMsg = (req, res) => {
    let data = req.body
    dbserver.unreadMsg(data, res)
}

// 未读消息标记为已读
exports.updateUnreadMsg = (req, res) => {
    let data = req.body
    dbserver.updateUnreadMsg(data, res)
}

// 获取群聊列表
exports.getGroup= (req, res) => {
    let data = req.body
    dbserver.getGroups(data, res)
}

// 获取最后一条消息
exports.getOneGroupMsg = (req, res) => {
    let gid = req.body.gid
    dbserver.getOneGroupMsg(gid, res)
}

// 未读消息标记为已读
exports.updateGroupTip = (req, res) => {
    let data = req.body
    dbserver.updateGroupTip(data, res)
}

// 更新最后通讯时间
exports.updateLastTime = (req, res) => {
    let data = req.body
    dbserver.updateLastTime(data, res)
}