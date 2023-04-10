import { MqttClient } from '../../../src/infrastructure/mqttClient';
import { ValveController } from '../../../src/services/valveController';

jest.mock('../../../src/infrastructure/mqttClient');

describe('ValveController', () => {
  let mqttClient: MqttClient;
  let valveController: ValveController;

  beforeEach(() => {
    mqttClient = new MqttClient('mqtt://test.mosquitto.org', 'wattx-client-1');
    valveController = new ValveController(mqttClient);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('setValveLevel', () => {
    it('should call mqttClient.publish with correct parameters', () => {
      const room = 'living_room';
      const level = 50;
      const expectedTopic = `/actuators/${room}`;
      const expectedMessage = JSON.stringify({ level });

      valveController.setValveLevel(room, level);

      expect(mqttClient.publish).toHaveBeenCalledTimes(1);
      expect(mqttClient.publish).toHaveBeenCalledWith(expectedTopic, expectedMessage);
    });
  });
});