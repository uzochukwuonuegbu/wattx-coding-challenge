import { NextFunction, Request, Response } from 'express-serve-static-core';
import mqtt from 'mqtt';

export type ExpressRouteFunc = (req: Request, res: Response, next?: NextFunction) => void | Promise<void>;

export interface IValveController {
    setValveLevel(room: string, level: number): void;
}

export interface IMqttClient {
    connect(): Promise<void>;
    subscribe(topic: string, options?: mqtt.IClientSubscribeOptions): Promise<void>;
    publish(topic: string, message: string, options?: mqtt.IClientPublishOptions): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    unsubscribe(topic: string): void;
    disconnect(): Promise<void>;
}

export interface ICache {
    hget: (key: string, field: string) => Promise<string | null>;
    hset: (key: string, field: string, value: string) => Promise<number>;
  }

export enum SensorDataType {
    TEMPERATURE = 'temperature',
}
export interface ISensorData {
    sensorID: string;
    type: SensorDataType;
    value: number;
  }

export enum MqttTopics {
    // sensor topics
    temperatureRoom1Reading = '/readings/room-1/temperature',
    temperatureRoom2Reading = '/readings/room-2/temperature',

    // actuators topics
    room1Actuator = '/actuators/room-1',
    room2Actuator = '/actuators/room-2',
    // ...
}

export interface IRoomTemperatureHandler {
	adjustValve: (room: string, temperature: number) => Promise<number>
}

export interface IRoomSensorEventHandler {
    processRoomSensorEvent: (topic: string, message: any) => void
}