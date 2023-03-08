const dbserver = require('../dao/dbserver')

// 好友申请
exports.applyFriend = (req, res) => {
   let data = req.body
   dbserver.applyFriend(data, res)
}

// 申请状态更新
exports.updateFriendState = (req, res) => {
   let data = req.body
   dbserver.updateFriendState(data, res)
}

// 拒绝或删除好友
exports.deleteFriend = (req, res) => {
   let data = req.body
   dbserver.deleteFriend(data, res)
}
