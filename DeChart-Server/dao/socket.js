module.exports = io => {
    // socket注册的用户
    let users = {}

    io.on('connection', socket => {
        // 用户登陆注册
        socket.on('login', id => {
            // 回复客户端
            socket.name = id
            users[id] = socket.id
            socket.emit('login', socket.id)
        })

        // 好友请求发送
        socket.on('request', (msg, toId) => {
            // 发送给对方
            socket.to(users[toId]).emit('request', msg)
        })

        // 用户一对一消息发送
        socket.on('msg', (msg, toId) => {
            // 发送给对方
            socket.to(users[toId]).emit('msg', msg)
        })


        // 用户离开
        socket.on('disconnecting', () => {
           if (users.hasOwnProperty(socket.name)) {
            delete users[socket.name]
            console.log(socket.id + '离开')
           }
        })

        // 加入群
        socket.on('group', data => {
            socket.join(data)
        })

        // 接收群消息
        socket.on('groupMsg', (msg, gid) => {
            socket.to(gid).emit('groupMsg', msg, gid)
        })
    })
}