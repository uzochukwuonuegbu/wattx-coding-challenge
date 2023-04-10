import { IRoomSensorEventHandler, IRoomTemperatureHandler, SensorDataType } from '../interfaces';

export class RoomSensorEventHandler implements IRoomSensorEventHandler {

    constructor(private roomTemperatureHandler: IRoomTemperatureHandler) {}

    public processRoomSensorEvent(topic: string, message: any): void {
        try {
            const data = JSON.parse(message.toString());
            const room = topic.split('/')[2]

            switch(data.type) {
                case SensorDataType.TEMPERATURE:
                    this.roomTemperatureHandler.adjustValve(room, data.value);
                    break;
                default:
                    break;
            }
        } catch(error) {
            throw error;
        }
    }
}
