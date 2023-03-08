const cors = require('cors')
const jwt  = require('./dao/jwt')

const express = require('express')
const app = express()
const port = 3000

// socket.io服务
const server = app.listen(8082)
const io = require('socket.io').listen(server)
require('./dao/socket')(io)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cors())


// 获取静态资源
app.use(express.static(__dirname + '/data'))

// token 判断
app.use((req, res, next) => {
    if (typeof(req.body.token) !== 'undefined') {
        // 处理token匹配
        let token = req.body.token
        let tokenMatch = jwt.verifyToken(token)

        if (tokenMatch === 1) {
            // 通过验证
            next()
        } else {
            res.send({status: 300, msg: 'token不匹配'})
        }
    } else {
        next()
    }
})

require('./router/index')(app)
require('./router/files')(app)

// 404页面
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 400 
    next(err)
})

// 出现错误处理
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message)
})


app.listen(port, () => console.log(`server satrted at http://127.0.0.1:${port}`))