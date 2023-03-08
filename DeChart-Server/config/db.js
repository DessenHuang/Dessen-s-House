const mongoose = require('mongoose')

const db = mongoose.createConnection('mongodb://localhost:27017/chartroom')

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.info('database connecting successed')
})

module.exports = db