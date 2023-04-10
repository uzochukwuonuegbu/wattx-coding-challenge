import { Request, Response } from 'express';
import { HeatingSystemController } from '../../../src/controllers/heatingSystem.controller';
import { IRoomTemperatureHandler, ISensorData, SensorDataType } from '../../../src/interfaces';

const mqttClientMock: any = {
  publish: jest.fn(),
};

const roomTemperatureHandlerMock: IRoomTemperatureHandler = {
  adjustValve: jest.fn(),
};

const heatingSystemController = new HeatingSystemController(mqttClientMock, roomTemperatureHandlerMock);

describe('HeatingSystemController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sensorValuePublisher', () => {
    it('should call mqttClient.publish with the correct arguments', async () => {
      const sensorData: ISensorData = {
        sensorID: 'sensor-1',
        type: SensorDataType.TEMPERATURE,
        value: 22
      };
      const message = JSON.stringify(sensorData);

      await heatingSystemController.sensorValuePublisher(sensorData);

      expect(mqttClientMock.publish).toHaveBeenCalledTimes(1);
      expect(mqttClientMock.publish).toHaveBeenCalledWith('/readings/room-2/temperature', message);
    });

    it('should catch and log errors and return the error', async () => {
      const sensorData: any = {
        sensorID: 'sensor-1',
        type: 'motion',
        value: 22
      };
      const errorMessage = 'Error publishing message';
      const publishSpy = jest.spyOn(mqttClientMock, 'publish').mockImplementation(() => { throw new Error(errorMessage); });

      const result = await heatingSystemController.sensorValuePublisher(sensorData);

      expect(publishSpy).toHaveBeenCalledTimes(1);
      expect(publishSpy).toHaveBeenCalledWith('/readings/room-2/temperature', JSON.stringify(sensorData));
      expect(result).toEqual(new Error(errorMessage));
    });
  });

  describe('setRoomTemperature', () => {
    const req: Partial<Request> = { body: { room: 'room1', temperature: 22 } };
    const res: Partial<Response> = { status: jest.fn(), json: jest.fn() };
    const adjustedValve = 80;

    beforeEach(() => {
      jest.spyOn(roomTemperatureHandlerMock, 'adjustValve').mockResolvedValue(adjustedValve);
    });

    it('should return the adjusted valve level and a 200 status code if roomTemperatureHandler.adjustValve succeeds', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await heatingSystemController.setRoomTemperature()(req as Request, res as Response);

      expect(roomTemperatureHandlerMock.adjustValve).toHaveBeenCalledTimes(1);
      expect(roomTemperatureHandlerMock.adjustValve).toHaveBeenCalledWith('room1', 22);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: `Set valve to ${adjustedValve}%` });
    });

    it('should return a 400 status code if roomTemperatureHandler.adjustValve throws an error', async () => {
      const adjustValveMock = jest.fn().mockRejectedValue(new Error("Error Message"));
      jest.spyOn(roomTemperatureHandlerMock, 'adjustValve').mockImplementation(adjustValveMock);

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
      await heatingSystemController.setRoomTemperature()(req as Request, res as Response);

      expect(roomTemperatureHandlerMock.adjustValve).toHaveBeenCalledTimes(1);
      expect(roomTemperatureHandlerMock.adjustValve).toHaveBeenCalledWith('room1', 22);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unable to set Room Temperature' });
    });
  });
});
