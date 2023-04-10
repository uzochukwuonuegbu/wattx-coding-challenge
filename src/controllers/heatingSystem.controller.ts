import { Request, Response } from "express";
import { ExpressRouteFunc, IHeatingSystemController, IMqttClient, IRoomTemperatureHandler, ISensorData, MqttTopics } from "../interfaces";
import { getMqttClient, getRoomTemperatureHandler } from '../services/services-injection';
import logger from "../utils/logger";

export class HeatingSystemController implements IHeatingSystemController {
    constructor(private mqttClient: IMqttClient = getMqttClient(), private roomTemperatureHandler: IRoomTemperatureHandler = getRoomTemperatureHandler()) {
    }

    // helper function to simulate periodic sensor event publishing
    public async sensorValuePublisher(sensorData: ISensorData): Promise<void> {
        try {
            const message = JSON.stringify(sensorData);
            return this.mqttClient.publish(MqttTopics.temperatureRoom2Reading, message);
        } catch(error) {
            logger.error('Unable to publish Room Temperature', error);
            return error;
        }
    }

    // Example client-facing API, using express
    public setRoomTemperature(): ExpressRouteFunc {
        return async (req: Request, res: Response) => {
        try {
            const { room, temperature } = req.body;
            const adjustedValve = await this.roomTemperatureHandler.adjustValve(room, temperature);
            res.status(200).json({ message: `Set valve to ${adjustedValve}%`});
        } catch(error) {
            logger.error('Unable to set Room Temperature', error);
            res.status(400).json({ message: 'Unable to set Room Temperature'});
        }
        }
    }
}