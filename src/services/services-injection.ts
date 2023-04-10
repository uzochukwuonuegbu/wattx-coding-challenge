import { RedisClientType } from 'redis';
import { generalConfig } from '../config';
import { MqttClient } from '../infrastructure/mqttClient';
import { RedisClient } from '../infrastructure/redisClient';
import { ICache, IMqttClient, IRoomSensorEventHandler, IRoomTemperatureHandler } from '../interfaces';
import { RoomSensorEventHandler } from './roomSensorEventHandler';
import { RoomTemperatureHandler } from './roomTemperatureHandler';
import { ValveController } from './valveController';

// simple factory, to support DI

export function getRoomSensorEventHandler(): IRoomSensorEventHandler{
	const roomTemperatureHandler = getRoomTemperatureHandler();
	return new RoomSensorEventHandler(roomTemperatureHandler);
}

export function getRoomTemperatureHandler(): IRoomTemperatureHandler {
	const mqttClient = getMqttClient();
	const cacheClient = getCacheClient();
	return new RoomTemperatureHandler(generalConfig, new ValveController(mqttClient), cacheClient);
}

export function getMqttClient(): IMqttClient {
	// make this based on env
	return new MqttClient('mqtt://test.mosquitto.org', 'wattx-client-1');
}

export function getCacheClient(): ICache {
	return new RedisClient();
}