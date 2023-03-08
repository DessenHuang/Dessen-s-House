const dbserver = require('../dao/dbserver')

// 用户搜索
exports.searchUser = (req, res) => {
    let data = req.body.data
    dbserver.searchUser(data, res)
}

// 判断是否为好友
exports.isFriend = (req, res) => {
    let uid = req.body.uid
    let fid = req.body.fid
    dbserver.isFriend(uid, fid, res)
}

// 群搜索
exports.searchGroup = (req, res) => {
    let data = req.body.data
    dbserver.searchGroup(data, res)
}

// 判断是否在群内
exports.isInGroup = (req, res) => {
    let uid = req.body.uid
    let gid = req.body.gid
    dbserver.isInGroup(uid, gid, res)
}