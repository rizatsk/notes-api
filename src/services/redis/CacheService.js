const { valid } = require('joi');
const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.log(error);
    });

    this._client.connect();
  }

  async set(key, value, experationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: experationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error('Cache tidak ditemukan');

    return result;
  }

  async delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
