const dbserver = require('../dao/dbserver')
// 引入邮箱发送方式
const emailServer = require('../dao/emailserver')
// 引入注册页面服务
const signUp = require('../server/signup')
// 引入登陆页面服务
const singIn = require('../server/signin')
// 引入搜索页面服务
const search = require('../server/search')
// 引入用户详情页面服务
const userDetail = require('../server/userdetail')
// 引入好友申请页面服务
const friend = require('../server/friend')
// 引入好友列表页面服务
const index = require('../server/index')
// 引入聊天消息页面服务
const chart = require('../server/chart')
// 引入建群页面服务
const group = require('../server/group')

module.exports = app => {
    app.post('/mail', (req, res) => {
        let mail = req.body.mail
        emailServer.emailSignUp(mail, res)
        // res.send(mail)
    })

    // 注册
    // 用户注册路由
    app.post('/signup/add', (req, res) => {
        signUp.signUp(req, res)
    })

    // 用户或邮箱是否已注册判断
    app.post('/signup/judge', (req, res) => {
        signUp.judgeValue(req, res)
    })

    // 登陆
    // 用户登陆路由
    app.post('/signin/match', (req, res) => {
        singIn.signIn(req, res)
    })

    // 搜索
    // 用户搜索路由
    app.post('/search/user', (req, res) => {
        search.searchUser(req, res)
    })

    // 判断是否为好友
    app.post('/search/isfriend', (req, res) => {
        search.isFriend(req, res)
    })

    // 群搜索路由
    app.post('/search/group', (req, res) => {
        search.searchGroup(req, res)
    })

    // 判断是否在群内
    app.post('/search/isingroup', (req, res) => {
        search.isInGroup(req, res)
    })

    // 用户
    // 用户详情路由
    app.post('/user/detail', (req, res) => {
        userDetail.userDetail(req, res)
    })

    // 用户信息修改路由
    app.post('/user/update', (req, res) => {
        userDetail.userUpdate(req, res)
    })

    // 好友请求
    // 好友申请路由
    app.post('/friend/applyfriend', (req, res) => {
        friend.applyFriend(req, res)
    })

    // 好友状态更新路由
    app.post('/friend/updatefriendstate', (req, res) => {
        friend.updateFriendState(req, res)
    })

    // 拒绝或删除好友路由
    app.post('/friend/deletefriend', (req, res) => {
        friend.deleteFriend(req, res)
    })

    // 主页
    // 获取好友列表路由
    app.post('/index/getfriend', (req, res) => {
        index.getFriend(req, res)
    })

    // 获取群列表路由
    app.post('/index/getground', (req, res) => {
        index.getGroup(req, res)
    })

    // 获取最后一条消息路由
    app.post('/index/getlastmsg', (req, res) => {
        index.getLastMsg(req, res)
    })

    // 汇总未读消息数路由
    app.post('/index/unreadmsg', (req, res) => {
        index.unreadMsg(req, res)
    })

    // 未读消息标记为已读路由
    app.post('/index/updateunreadmsg', (req, res) => {
        index.updateUnreadMsg(req, res)
    })

    // 更新最后通讯时间
    app.post('/index/updatelasttime', (req, res) => {
        index.updateLastTime(req, res)
    })

    // 获取群聊列表路由
    app.post('/index/getgroup', (req, res) => {
        index.getGroup(req, res)
    })

    // 获取群聊最后一条消息路由
    app.post('/index/getonegroupmsg', (req, res) => {
        index.getOneGroupMsg(req, res)
    })

    // 群聊未读消息标记为已读路由
    app.post('/index/updategrouptip', (req, res) => {
        index.updateGroupTip(req, res)
    })

    // 聊天页面
    // 获取聊天页面消息
    app.post('/chart/msg', (req, res) => {
        chart.msg(req, res)
    })

    // 新增聊天消息
    app.post('/chart/insertmsg', (req, res) => {
        chart.insertMsg(req, res)
    })

    // 建群页面
    // 建群
    app.post('/group/creategroup', (req, res) => {
        group.createGroup(req, res)
    })

    // 获取群消息
    app.post('/chart/getgroupmsg', (req, res) => {
        chart.msgGroup(req, res)
    })

    // 新增群聊消息
    app.post('/chart/insertgroupmsg', (req, res) => {
        chart.insertGroupMsg(req, res)
    })

    // 群详情
    app.post('/group/detail', (req, res) => {
        group.groupDetail(req, res)
    })

    // 群详情修改
    app.post('/group/update', (req, res) => {
        group.groupUpdate(req, res)
    })

    // 获取群成员
    app.post('/group/members', (req, res) => {
        group.getGroupUser(req, res)
    })

    // 邀请入群
    app.post('/group/applymember', (req, res) => {
        group.applyMember(req, res)
    })

    // 移出群聊
    app.post('/group/movemember', (req, res) => {
        group.moveGroupUser(req, res)
    })

    // 退出群聊
    app.post('/group/getout', (req, res) => {
        group.getOutGroup(req, res)
    })

    // 退出群聊
    app.post('/group/dissolvegroup', (req, res) => {
        group.dissolveGroup(req, res)
    })
}