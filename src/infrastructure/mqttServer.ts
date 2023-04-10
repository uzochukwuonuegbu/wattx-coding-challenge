import { IMqttClient, IRoomSensorEventHandler, MqttTopics } from '../interfaces';
import { getMqttClient, getRoomSensorEventHandler } from '../services/services-injection';

export class MqttServer {
    constructor(private roomSensorEventHandler: IRoomSensorEventHandler = getRoomSensorEventHandler(), private mqttClient: IMqttClient = getMqttClient()) {
        this.roomSensorEventHandler.processRoomSensorEvent = this.roomSensorEventHandler.processRoomSensorEvent.bind(this.roomSensorEventHandler);
    }

    public async start(): Promise<void> {
        await this.initSubscribers();
        this.mqttClient.on('message', this.roomSensorEventHandler.processRoomSensorEvent);
    }

    private async initSubscribers(): Promise<void> {
        await this.mqttClient.connect();
        await this.mqttClient.subscribe(MqttTopics.temperatureRoom1Reading);
        await this.mqttClient.subscribe(MqttTopics.temperatureRoom2Reading);
        // ...add subscribe
    }
}