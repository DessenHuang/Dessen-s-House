const mongoose = require('mongoose')
const db = require('../config/db')
const Schema = mongoose.Schema
const dayjs = require('dayjs')

// 用户表规则
const userSchema = new Schema({
    // 昵称
    name: String,
    // 密码
    password: String,
    // 邮箱
    email: String,
    // 性别, 女0 男1 保密2
    sex: {
        type: Number,
        default: 2
    },
    // 生日
    birth: {
        type: Date,
        default: new Date()
    },
    // 手机
    phone: {
        type: String,
        default: '000-0000'
    },
    // 介绍
    intro: {
        type: String,
        default: '这家伙很懒,还没留下任何信息'
    },
    // 用户头像
    iconPath: {
        type: String,
        default: 'user.png'
    },
    // 注册时间
    time: Date
})

// 好友列表规则
const friendSchema = new Schema({
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 好友id
    friendID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 好友申请状态(0已为好友，1申请中，2申请发送方)
    state: Number,
    // 最后通讯时间
    lastTime: Date
})

// 一对一消息表规则
const messageSchema = new Schema({
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 好友id
    friendID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 内容
    message: Object || String,
    //内容类型(0是文字，1是图片，2是定位信息)
    types: Number,
    // 发送时间
    time: Date,
    // 未读消息数 0已读 1未读
    state: Number
})

// 群表规则
const groupSchema = new Schema({
    // 群主id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 群名
    name: String,
    // 群公告
    notice: {
        type: String,
        default: `创建于${dayjs(new Date()).format('YYYY-MM-DD')}`
    },
    // 群头像
    iconPath: {
        type: String,
        default: 'group.png'
    },
    // 创建时间
    time: Date,
    // 最后通讯时间
    lastTime: {
        type: Date,
        default: new Date()
    }
})

// 群成员表规则
const groupUserSchema = new Schema({
    // 群id
    groupID: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 群内名称
    name: String,
    // 未读消息数
    tip: {
        type: Number,
        default: 0,
    },
    // 进群时间
    time: Date,
    // 是否屏蔽群消息
    shield: {
        type: Boolean,
        default: false // 默认情况下不屏蔽
    }
})

// 群消息表规则
const groupMsgSchema = new Schema({
    // 群id
    groupID: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    // 用户id
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // 内容
    message: Object || String,
    //内容类型(0是文字，1是图片，2是定位信息)
    types: Number,
    // 发送时间
    time: Date
})


module.exports = db.model('User', userSchema)
module.exports = db.model('Friend', friendSchema)
module.exports = db.model('Message', messageSchema)
module.exports = db.model('Group', groupSchema)
module.exports = db.model('GroupUser', groupUserSchema)
module.exports = db.model('GroupMessage', groupMsgSchema)