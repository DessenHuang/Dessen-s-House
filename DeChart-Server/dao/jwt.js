// token
// 引入token
const jwt = require('jsonwebtoken')

let secret = 'dessenchartroom'

// 生成token
exports.generateToken = e => {
    let payload = {
        id: e,
        time: new Date()
    }
    let token  = jwt.sign(payload, secret, {expiresIn: 60*60*24*30}) // token时限设置30天过期

    return token
}

// 解码token
exports.verifyToken = e => {
    let payload
    jwt.verify(e, secret, (err, result) => {
        if (err) {
            payload = 0
        } else {
            payload = 1
        }
    })
    return payload
}