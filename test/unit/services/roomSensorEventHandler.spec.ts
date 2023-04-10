import { RoomSensorEventHandler } from '../../../src/services/roomSensorEventHandler';
import { IRoomTemperatureHandler, SensorDataType } from '../../../src/interfaces';

class MockRoomTemperatureHandler implements IRoomTemperatureHandler {
  public async adjustValve(room: string, value: number): Promise<number> { return value + 1 }
}

describe('RoomSensorEventHandler', () => {
  let roomSensorEventHandler: RoomSensorEventHandler;
  let mockRoomTemperatureHandler: MockRoomTemperatureHandler;
  let adjustValveSpy: jest.SpyInstance<Promise<number>, [string, number]>;

  beforeEach(() => {
    mockRoomTemperatureHandler = new MockRoomTemperatureHandler();
    roomSensorEventHandler = new RoomSensorEventHandler(mockRoomTemperatureHandler);
    adjustValveSpy = jest.spyOn(mockRoomTemperatureHandler, 'adjustValve');
  });

  afterEach(() => {
    adjustValveSpy.mockReset();
  });

  it('should process a temperature sensor event correctly', () => {
    const topic = '/readings/room-1/temperature';
    const message = JSON.stringify({
      type: SensorDataType.TEMPERATURE,
      value: 20,
    });
    roomSensorEventHandler.processRoomSensorEvent(topic, message);
    expect(adjustValveSpy).toHaveBeenCalledWith('room-1', 20);
  });

  it('should not process non-temperature sensor events', () => {
    const topic = 'readings/room-1/motion';
    const message = JSON.stringify({
      type: 'motion',
      value: 28,
    });
    roomSensorEventHandler.processRoomSensorEvent(topic, message);
    expect(adjustValveSpy).not.toHaveBeenCalled();
  });
});