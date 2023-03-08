// 引入加密模块
const bcrypt = require('../dao/bcrypt')
// 引入token模块
const jwt = require('../dao/jwt')

const dbmodel = require('../model/dbmodel')
const User = dbmodel.model('User')
const Friend = dbmodel.model('Friend')
const Group = dbmodel.model('Group')
const GroupUser = dbmodel.model('GroupUser')
const GroupMessage = dbmodel.model('GroupMessage')
const Message = dbmodel.model('Message')

// 新建用户
exports.createUser = (name, mail, pwd, res) => {
    // 密码加密
    let password = bcrypt.encryption(pwd)

    // 生成用户数据
    let data = {
        name: name,
        email: mail,
        password: password,
        time: new Date()
    }

    let user = new User(data)

    user.save((err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 匹配用户表元素个数(检验账户是否已注册)
exports.countUserValue = (data, type, res) => {
    let wherestr = {}
    wherestr[type] = data

    User.countDocuments(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 用户登陆验证
exports.userMatch = (data, pwd, res) => {
    let wherestr = { $or: [{ 'name': data }, { 'email': data }] }
    let out = { 'name': 1, 'iconPath': 1, 'password': 1 }

    User.findOne(wherestr, out, (err, result) => {
        if (err) return res.send({ status: 500 })

        // 用户注册情况判断
        if (result === null)  return res.send({ status: 300, msg: '该账户未注册' })

        // 密码解码
        const pwdMatch = bcrypt.verification(pwd, result.password)

        if (pwdMatch) {
            // 生成token
            let token = jwt.generateToken(result._id)
            // 生成返回数据
            let backData = {
                id: result._id,
                name: result.name,
                iconPath: result.iconPath,
                token: token
            }
            res.send({ status: 200, backData })

        } else {
            // 密码匹配失败
            res.send({ status: 400, msg: '账号密码错误' })
        }
        
        // result.map(e => {
        //     // 判断账户是否已注册
        //     if (e.name === data || e.email === data) emptyUser = false

        //     // 密码解码
        //     const pwdMatch = bcrypt.verification(pwd, e.password)

        //     if (pwdMatch) {
        //         // 生成token
        //         let token = jwt.generateToken(e._id)
        //         // 生成返回数据
        //         let backData = {
        //             id: e._id,
        //             name: e.name,
        //             iconPath: e.iconPath,
        //             token: token
        //         }
        //         res.send({ status: 200, backData })

        //     } else {
        //         // 密码匹配失败
        //         res.send({ status: 400, msg: '账号密码错误' })
        //     }
        // })

        // 账户未注册
        // if (emptyUser) res.send({ status: 300, msg: '该账户未注册' })

    })
    
}

// 用户搜索
exports.searchUser = (data, res) => {
    let wherestr = { $or: [{ 'name': { $regex: data } }, { 'email': { $regex: data } }] }
    let out = {
        'name': 1,
        'email': 1,
        'iconPath': 1
    }

    User.find(wherestr, out, (err, result) => {
        if (err) return res.send({ status: 500 })

        res.send({ status: 200, result })
    })
}

// 判断是否为好友
exports.isFriend = (uid, fid, res) => {
    let wherestr = {
        'userID': uid,
        'friendID': fid,
        'state': 0
    }

    // 用户为自己时
    if (uid === fid) return res.send({ status: 300 })

    Friend.findOne(wherestr, (err, result) => {
        if (err) return res.send({ status: 500 })

        if (result) {
            // 是好友
            res.send({ status: 200 })
        } else {
            // 不是好友
            res.send({ status: 400 })
        }
    })
}

// 群搜索
exports.searchGroup = (data, res) => {
    let wherestr = { $or: [{ 'name': { $regex: data } }] }
    let out = {
        'name': 1,
        'iconPath': 1
    }

    Group.find(wherestr, out, (err, result) => {
        if (err) return res.send({ status: 500 })

        res.send({ status: 200, result })
    })
}

// 判断是否在群内
exports.isInGroup = (uid, gid, res) => {
    let wherestr = {
        'userID': uid,
        'groupID': gid
    }

    GroupUser.findOne(wherestr, (err, result) => {
        if (err) return res.send({ status: 500 })

        if (result) {
            // 在群内
            res.send({ status: 200 })
        } else {
            // 不在群内
            res.send({ status: 400 })
        }
    })
}

// 用户详情
exports.userDetail = (id, res) => {
    let wherestr = { '_id': id }
    let out = { 'password': 0 }
    User.findOne(wherestr, out, (err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 用户信息修改
exports.userUpdate = (data, res) => {
    let updateStr = {}
    // 如果要修改属性为密码,则进行加密再赋值
    updateStr[data.type] = data.type === 'password' ? bcrypt.encryption(data.data) : data.data

    User.findByIdAndUpdate(data.id, updateStr, (err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 好友操作
// 添加好友表
exports.buildFriend = (uid, fid, state) => {
    let data = {
        userID: uid,
        friendID: fid,
        state: state,
        lastTime: new Date()
    }

    let friend = new Friend(data)

    friend.save((err, result) => {
        if (err) return console.log(err)
    })
}

// 更新好友申请消息
exports.updateApply = (uid, fid, msg, res) => {
    let wherestr = {
        'userID': uid,
        'friendID': fid
    }
    // 更新最后通讯时间或申请消息
    let updateStr = { 'time': new Date(), 'message': msg }

    Message.updateOne(wherestr, updateStr, (err, result) => {
        if (err) return console.log(err)

        res.send({ status: 200, result })
    })
}

// 更新最后通讯时间
exports.updateLastTime = data => {
    let updateStr = { 'lastTime': new Date() }

    if (data.type === 'group') {
        // 更新群最后通讯时间
        let wherestr = { groupID: data.gid }

        Group.updateOne(wherestr, updateStr, (err, result) => {
            if (err) return console.log(err)

        })
    } else {
        // 更新好友最后通讯时间
        let wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] }

        Friend.updateMany(wherestr, updateStr, (err, result) => {
            if (err) return console.log(err)

        })
    }
}

// 添加一对一消息表
exports.insertMsg = (uid, fid, msg, type, res) => {
    let data = {
        userID: uid,
        friendID: fid,
        message: msg,
        types: type,
        state: 1,
        time: new Date()
    }

    let message = new Message(data)

    message.save((err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 好友申请表
exports.applyFriend = (data, res) => {
    // 判断是否已经申请过
    let wherestr = {
        'userID': data.uid,
        'friendID': data.fid
    }
    Friend.countDocuments(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        if (result === 0) {
            // 初次申请
            this.buildFriend(data.uid, data.fid, 2)
            this.buildFriend(data.fid, data.uid, 1)

            // 添加申请消息
            this.insertMsg(data.uid, data.fid, data.msg, 0, res)
        } else {
            // 已经申请过好友
            this.updateLastTime(data.uid, data.fid)
            this.updateLastTime(data.fid, data.uid)
            this.updateApply(data.uid, data.fid, data.msg, res)
        }
    })
}

// 更新好友转态
exports.updateFriendState = (data, res) => {
    // 修改项
    let wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] }
    Friend.updateMany(wherestr, { 'state': 0 }, (err, result) => {
        if (err) return res.send({ status: 500, err })

        res.send({ status: 200 })
    })
}

// 拒绝好友或删除好友
exports.deleteFriend = (data, res) => {
    // 修改项
    let wherestr = { $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] }
    Friend.deleteMany(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, err })
    })

    // 删除对应聊天记录
    Message.deleteMany(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, err })

        res.send({ status: 200 })
    })

}

// 按要求获取用户列表
exports.getUser = data => {
    return new Promise((resolve, reject) => {
        let query = Friend.find({})
        // 查询条件
        query.where({ 'userID': data.uid, 'state': data.state })
        // 查找friendID关联的对象
        query.populate('friendID')
        // 排序 -1为大到小排序
        query.sort({ 'lastTime': -1 })
        // 查询结果
        query.exec().then(e => {
            let result = e.map(item => {
                return {
                    id: item.friendID._id,
                    name: item.friendID.name,
                    iconPath: item.friendID.iconPath,
                    lastTime: item.lastTime,
                    type: 0
                }
            })
            resolve(result)
        }).catch(err => {
            reject({ status: 500, err })
        })
    })
}

// 按要求获取一对一消息
const getOneMsg = (uid, fid) => {
    return new Promise((resolve, reject) => {
        let query = Message.findOne({})
        // 查询条件
        query.where({ $or: [{ 'userID': uid, 'friendID': fid }, { 'userID': fid, 'friendID': uid }] })
        // 排序 -1为大到小排序
        query.sort({ 'time': -1 })
        // 查询结果
        query.exec().then(e => {
            let result = {
                message: e.message,
                time: e.time,
                types: e.types
            }
            resolve(result)
        }).catch(err => {
            reject({ status: 500, err })
        })
    })
}

// 汇总一对一未读消息数
const unreadMsg = (uid, fid) => {
    return new Promise((resolve, reject) => {
        // 汇总条件
        let wherestr = { 'userID': fid, 'friendID': uid, 'state': 1 }
        Message.countDocuments(wherestr, (err, result) => {
            if (err) return reject({ status: 500, err })

            resolve(result)
        })
    })
}

// 联合查找好友及最后一条消息及未读数据
const doIt = async (data, res) => {
    let result, lastMsg, unreadMsgs, err
    [err, result] = await this.getUser(data).then(data => [null, data]).catch(err => [err, null])
    if (result) {
        for (let i = 0; i < result.length; i++) {
            [err, lastMsg] = await getOneMsg(data.uid, result[i].id).then(data => [null, data]).catch(err => [err, null])
            if (lastMsg.types === 0) {
                result[i].msg = lastMsg.message
            } else if (lastMsg.types === 1) {
                result[i].msg = '[图片]'
            } else if (lastMsg.types === 2) {
                result[i].msg = '[位置]'
            }
            [err, unreadMsgs] = await unreadMsg(data.uid, result[i].id).then(data => [null, data]).catch(err => [err, null])
            result[i].tip = unreadMsgs
        }
    }

    if (err) return res.send(err)

    res.send({ status: 200, result })
}

exports.getUsers = (data, res) => {
    doIt(data, res)
}

// 一对一消息状态修改
exports.updateUnreadMsg = (data, res) => {
    // 修改项条件
    let wherestr = { 'userID': data.fid, 'friendID': data.uid, 'state': 1 }
    // 修改内容
    let updatestr = { 'state': 0 }

    Message.updateMany(wherestr, updatestr, (err, result) => {
        if (err) return res.send({ status: 500, err })

        res.send({ status: 200, result })
    })
}

// 新建群
exports.createGroup = (data, res) => {
    return new Promise((resolve, reject) => {
        // 生成群信息
        let groupData = {
            userID: data.uid,
            name: data.name,
            iconPath: data.iconPath,
            time: new Date()
        }
        let group = new Group(groupData)

        group.save((err, result) => {
            if (err) reject({ status: 500, err })

            resolve({ status: 200, result })
        })
    }).then(value => {
        // 添加好友入群
        data.users.forEach(uid => {
            let fdata = {
                groupID: value.result._id,
                userID: uid,
                time: new Date(),
                lastTime: new Date()
            }
            // 加入
            this.insertGroupUser(fdata, res)
        })

        // 创建成功
        res.send({ status: 200, value })
    }).catch(error => {
        res.send({ status: 500, error })
    })

}

// 群操作
// 添加群成员
exports.insertGroupUser = (data, res) => {
    let groupuser = new GroupUser(data)

    groupuser.save((err, result) => {
        if (err) return res.send({ status: 500, err })
    })
}

// 按要求获取群列表
exports.getGroup = data => {
    return new Promise((resolve, reject) => {
        let query = GroupUser.find({})
        // 查询条件
        query.where({ 'userID': data.uid })
        // 查找groupID关联的对象
        query.populate('groupID')
        // 排序 -1为大到小排序
        query.sort({ 'lastTime': -1 })
        // 查询结果
        query.exec().then(e => {
            let result = e.map(item => {
                return {
                    gid: item.groupID._id,
                    name: item.groupID.name,
                    iconPath: item.groupID.iconPath,
                    lastTime: item.groupID.lastTime,
                    tip: item.tip
                }
            })
            resolve(result)
        }).catch(err => {
            reject({ status: 500, err })
        })
    })

}

// 按要求获取群消息
const getOneGroupMsg = gid => {
    return new Promise((resolve, reject) => {
        let query = GroupMessage.findOne({})
        // 查询条件
        query.where({ 'groupID': gid })
        // 关联的user对象
        query.populate('userID')
        // 排序 -1为大到小排序
        query.sort({ 'time': -1 })
        // 查询结果
        query.exec().then(e => {
            let result = {
                message: e.message,
                time: e.time,
                types: e.types,
                name: e.userID.name
            }
            resolve(result)
        }).catch(err => {
            reject({ status: 500, err })
        })
    })

}

// 联合查找群及最后一条消息
const doGroupIt = async (data, res) => {
    let result, lastMsg, err
    [err, result] = await this.getGroup(data).then(data => [null, data]).catch(err => [err, null])

    if (result) {
        for (let i = 0; i < result.length; i++) {
            [err, lastMsg] = await getOneGroupMsg(result[i].gid).then(data => [null, data]).catch(err => [err, null])
            if (!lastMsg) return

            if (lastMsg.types === 0) {
                result[i].msg = lastMsg.message
            } else if (lastMsg.types === 1) {
                result[i].msg = '[图片]'
            } else if (lastMsg.types === 2) {
                result[i].msg = '[位置]'
            }

        }
    }

    if (err) return res.send(err)

    res.send({ status: 200, result })
}

exports.getGroups = (data, res) => {
    doGroupIt(data, res)
}

// 添加群消息表
exports.insertGroupMsg = (uid, gid, msg, type, res) => {
    let data = {
        userID: uid,
        groupID: gid,
        message: msg,
        types: type,
        state: 1,
        time: new Date()
    }

    let groupMsg = new GroupMessage(data)

    groupMsg.save((err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 群消息状态修改
exports.updateGroupTip = (data, res) => {
    // 修改项条件
    let wherestr = { 'userID': data.uid, 'groupID': data.gid }
    // 修改内容
    let updatestr = { 'tip': data.tip }

    GroupUser.updateOne(wherestr, updatestr, (err, result) => {
        if (err) return res.send({ status: 500, err })

        res.send({ status: 200, result })
    })
}

// 获取群详情
exports.groupDetail = (gid, res) => {
    let wherestr = { '_id': gid }
    let out = { 'userId': 0 }
    Group.findOne(wherestr, out, (err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 群详情修改
exports.groupUpdate = (data, res) => {
    let updateStr = {}

    updateStr[data.type] = data.data

    Group.findByIdAndUpdate(data.id, updateStr, (err, result) => {
        if (err) return res.send({ status: 500, msg: err })

        res.send({ status: 200, result })
    })
}

// 获取群成员
exports.getGroupUser = (data, res) => {
    let query = GroupUser.find({})
    // 查询条件
    query.where({ 'groupID': data.gid })
    // 查找userID关联的对象
    query.populate('userID')
    // 排序 -1为大到小排序
    query.sort({ 'lastTime': 1 })
    // 查询结果
    query.exec().then(e => {
        let result = e.map(item => {
            return {
                id: item.userID._id,
                name: item.userID.name,
                iconPath: item.userID.iconPath,
            }
        })
        res.send({ status: 200, result })
    }).catch(err => {
        res.send({ status: 500, err })
    })
}

// 邀请好友入群
exports.applyMember = (data, res) => {
    data.users.forEach(uid => {
        let fdata = {
            groupID: data.gid,
            userID: uid,
            time: new Date(),
            lastTime: new Date()
        }
        // 加入
        this.insertGroupUser(fdata, res)

        res.send({status: 200})
    })
}

// 移出群聊
exports.moveGroupUser = (data, res) => {
    // 修改项
    let wherestr = { groupID: data.gid, userID: data.uid }
    GroupUser.deleteOne(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, err })

        res.send({ status: 200 })
    })

}

// 退出群聊
exports.getOutGroup = (data, res) => {
    // 修改项
    let wherestr = { groupID: data.gid, userID: data.uid }
    GroupUser.deleteOne(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, err })

        res.send({ status: 200 })
    })

}

// 解散群
exports.dissolveGroup = (gid, res) => {
    // 修改项
    let wherestr = { groupID: gid }

    Group.deleteOne(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, err })
    })

    // 删除对应聊天记录
    GroupMessage.deleteMany(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, err })
    })

    // 清除所有成员信息
    GroupUser.deleteMany(wherestr, (err, result) => {
        if (err) return res.send({ status: 500, err })

        res.send({ status: 200 })
    })

}

// 消息操作
// 获取一对一聊天数据
exports.msg = (data, res) => {
    let query = Message.find({})

    // 查询条件
    query.where({ $or: [{ 'userID': data.uid, 'friendID': data.fid }, { 'userID': data.fid, 'friendID': data.uid }] })
    // 按通讯时间排序
    query.sort({ 'time': 1 })
    // 关联的user对象
    query.populate('userID')
    // 查询结果
    query.exec().then(e => {
        let result = e.map(item => {
            return {
                id: item._id,
                message: item.message,
                types: item.types,
                time: item.time,
                fromId: item.userID._id,
                iconPath: item.userID.iconPath
            }
        })

        res.send({ status: 200, result })
    }).catch(err => {
        res.send({ status: 500, err })
    })
}

// 获取群消息
exports.msgGroup = (data, res) => {
    let query = GroupMessage.find({})

    // 查询条件
    query.where({ groupID: data.gid })
    // 按通讯时间排序
    query.sort({ 'time': 1 })
    // 关联的user对象
    query.populate('userID')
    // 查询结果
    query.exec().then(e => {
        let result = e.map(item => {
            return {
                id: item._id,
                message: item.message,
                types: item.types,
                time: item.time,
                fromId: item.userID._id,
                iconPath: item.userID.iconPath
            }
        })

        res.send({ status: 200, result })
    }).catch(err => {
        res.send({ status: 500, err })
    })
}