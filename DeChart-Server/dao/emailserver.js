// 引入发送邮件插件
const nodeMailer = require('nodemailer')
// 引入证书文件
const credentials = require('../config/credentials')

//创建传输方式
let transporter = nodeMailer.createTransport({
    service: 'qq',
    auth: {
        user: credentials.qq.user,
        pass: credentials.qq.pass
    }
})

// 注册时发送邮件给用户
exports.emailSignUp = (email, res) => {
    // 发送信息内容
    let options = {
        from: '1539307889@qq.com',
        to: email,
        subject: '感谢您的注册',
        html: '<span>DeChart聊天室欢迎您的加入!</span><a href="http://localhost:8080">点击</a>'
    }

    // 发送邮件
    transporter.sendMail(options, (err, msg) => {
        if (err) {
            res.send('邮箱发送失败')
            console.log(err)
        } else {
            res.send('邮箱发送成功')
            console.log('邮箱发送成功！')
        }
    })
}