const MongoClient = require('mongodb').MongoClient
const settings = require('./settings.json')
const mongoConfig = settings.mongoConfig
const ck = require("ckey")

let _connection = undefined
let _db = undefined

module.exports = {
    dbConnection: async () => {
        if (!_connection) {
            // _connection = await MongoClient.connect(mongoConfig.serverUrl)
            _connection = await MongoClient.connect(ck.MONGO_URL)
            _db = await _connection.db(mongoConfig.database)
        }

        return _db
    },
    closeConnection: () => {
        _connection.close()
    },
}