const redis = require("redis");
const ck = require("ckey")

const client = redis.createClient({
    url: ck.REDIS_URL
});

module.exports = client;
