const bcrypt = require('bcryptjs')

// 加密
exports.encryption = (pwd) => {
    // 生成随机salt
    let salt = bcrypt.genSaltSync(10)

    //生成hash密码
    let hash = bcrypt.hashSync(pwd, salt)

    return hash
}

// 解密
exports.verification = (pwd, hash) => {
    // 匹配成功返回true, 反之返回false
    let verify = bcrypt.compareSync(pwd, hash)

    return verify
}