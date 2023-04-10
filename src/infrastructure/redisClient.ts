import redis from 'redis';
import { generalConfig } from '../config';
import { ICache } from '../interfaces';

export class RedisClient implements ICache {
  private redisClient: redis.RedisClientType;

  constructor() {
    this.redisClient = redis.createClient({ url: generalConfig.redisUrl });
    this.redisClient.on('connect',()=>{
      console.log("redis connected")
    });
    this.redisClient.on("error", (err) => {
      console.log(`Error ${err}`);
    });
  }

  public async hget(key: string, field: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.redisClient.hget(key, field, (error, data) => {
        if (error) {
          console.error(`Error accessing cache`, error);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  public async hset(key: string, field: string, value: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.hset(key, field, value, (error, data) => {
        if (error) {
          console.error(`Error accessing cache`, error);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
}