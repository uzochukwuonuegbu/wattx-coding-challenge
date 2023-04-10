import { IMqttClient, IValveController } from '../interfaces';

export class ValveController implements IValveController {
    constructor(private mqttClient: IMqttClient) {
    }

    public setValveLevel(room: string, level: number): void {
      const message = JSON.stringify({ level });
      this.mqttClient.publish(`/actuators/${room}`, message);
    }
  }
