import dotenv from 'dotenv';
dotenv.config();

export enum EnumEnvironment {
  Prod = 'prod',
  Dev = 'dev',
}

export const generalConfig = {
    defaultValveLevel: process.env.DEFAULT_VALVE_LEVEL || 50,
    cozyTemperature: process.env.COZY_TEMPERATURE || 22,
    redisUrl: process.env.REDIS_URL || '127.0.0.1:6379'
}