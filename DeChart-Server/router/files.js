// 引入附件上传插件
const multer = require('multer')
// 引入文件创建功能模块
const mkdir = require('../dao/mkdir')

// 控制文件存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 路径
        let url = req.body.url
        mkdir.mkdirs('../data/' + url, err => {
            // console.log(err)
        })
        cb(null, './data/'+url)
    },
    filename: function (req, file, cb) {
        let name = req.body.name

        // 正则匹配后缀名
        let type = file.originalname.replace(/.+\./, '.')
        cb(null, name+type)
    }
})

const upload = multer({ storage: storage })

module.exports = app => {
    // 前端文件上传
    app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
        // 路径
        let url = req.body.url
        // 获取文件名
        let fileName = req.files[0].filename
        // let imgUrl = `/${url}/${name}`
        
        res.send(fileName)
    })

}