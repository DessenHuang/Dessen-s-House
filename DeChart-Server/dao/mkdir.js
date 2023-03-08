// 新建目录
const fs = require('fs')
const path = require('path')

exports.mkdirs = (pathname, callback) => {
    // 判断是否绝对路径
    pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname)
    // 获取相对路径
    pathname = path.relative(__dirname, pathname)
    let floders = pathname.split(path.sep)
    let pre = ""
   
    floders.forEach(floder => {
      try {
        let _stat = fs.statSync(path.join(__dirname, pre, floder))
        let hasMkdir = _stat && _stat.isDirectory()
        if (hasMkdir) {
            callback()
        }
      } catch(error) {
        try {
            fs.mkdirSync(path.join(__dirname, pre, floder))
            callback && callback(null)
        } catch(error) {
            callback && callback(error)
        }
      }
      // 路径拼合
      pre = path.join(pre, floder)
    })
}