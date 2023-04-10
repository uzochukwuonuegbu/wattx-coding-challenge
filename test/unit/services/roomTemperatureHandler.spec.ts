import { generalConfig } from '../../../src/config';
import { RoomTemperatureHandler } from '../../../src/services/roomTemperatureHandler';

describe('RoomTemperatureHandler', () => {
  let mockConfig;
  let mockValveController;
  let mockCache;
  let roomTemperatureHandler;

  beforeEach(() => {
    mockConfig = {
      cozyTemperature: 22,
      defaultValveLevel: 50,
    };

    mockValveController = {
      setValveLevel: jest.fn(),
    };

    mockCache = {
      hget: jest.fn(),
      hset: jest.fn(),
    };

    roomTemperatureHandler = new RoomTemperatureHandler(mockConfig, mockValveController, mockCache);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('adjustValve', () => {
    it('should calculate and set the adjusted valve level', async () => {
      const mockCurrentValveLevel = 40;
      const mockAdjustedValve = 50;

      mockCache.hget.mockResolvedValue(mockCurrentValveLevel);
      roomTemperatureHandler.calculateValveLevel = jest.fn().mockReturnValue(mockAdjustedValve);

      const result = await roomTemperatureHandler.adjustValve('room1', 19);

      expect(mockCache.hget).toHaveBeenCalledWith('room1', 'valuveLevel');
      expect(roomTemperatureHandler.calculateValveLevel).toHaveBeenCalledWith(19, mockCurrentValveLevel);
      expect(mockCache.hset).toHaveBeenCalledWith('room1', 'valuveLevel', mockAdjustedValve.toString());
      expect(mockValveController.setValveLevel).toHaveBeenCalledWith('room1', mockAdjustedValve);
      expect(result).toEqual(mockAdjustedValve);
    });

    it('should throw an error if any of the internal methods throw an error', async () => {
      const mockError = new Error('Cache read failed');
      mockCache.hget.mockRejectedValue(mockError);

      await expect(roomTemperatureHandler.adjustValve('room1', 19)).rejects.toThrow(mockError);
      expect(mockCache.hget).toHaveBeenCalledWith('room1', 'valuveLevel');
      expect(mockCache.hset).not.toHaveBeenCalled();
      expect(mockValveController.setValveLevel).not.toHaveBeenCalled();
    });
  });

  describe('calculateValveLevel', () => {
    it('should increase valve level if temperature is below cozy temp level', () => {
      const currentValveLevel = 50;
      const temperature = 18;
      const expectedValveLevel = 60;
      const result = roomTemperatureHandler.calculateValveLevel(temperature, currentValveLevel);
      expect(result).toBe(expectedValveLevel);
    });
  
    it('should decrease valve level if temperature is above cozy temp level', () => {
      const currentValveLevel = 80;
      const temperature = 24;
      const expectedValveLevel = 70;
      const result = roomTemperatureHandler.calculateValveLevel(temperature, currentValveLevel);
      expect(result).toBe(expectedValveLevel);
    });
  
    it('should not increase valve level beyond 100', () => {
      const currentValveLevel = 95;
      const temperature = 16;
      const expectedValveLevel = 100;
      const result = roomTemperatureHandler.calculateValveLevel(temperature, currentValveLevel);
      expect(result).toBe(expectedValveLevel);
    });
  
    it('should not decrease valve level below 0', () => {
      const currentValveLevel = 5;
      const temperature = 25;
      const expectedValveLevel = 0;
      const result = roomTemperatureHandler.calculateValveLevel(temperature, currentValveLevel);
      expect(result).toBe(expectedValveLevel);
    });
  });

  describe('getRoomValveLevel', () => {
    it('should return cached value if exists', async () => {
      mockCache.hget.mockResolvedValue('75');

      const result = await roomTemperatureHandler.getRoomValveLevel('bedroom');

      expect(mockCache.hget).toHaveBeenCalledWith('bedroom', 'valuveLevel');
      expect(result).toBe(75);
    });

    it('should return default value if cache is empty', async () => {
      mockCache.hget.mockResolvedValue(null);

      const result = await roomTemperatureHandler.getRoomValveLevel('bedroom');

      expect(mockCache.hget).toHaveBeenCalledWith('bedroom', 'valuveLevel');
      expect(result).toBe(50);
    });

    it('should throw error if cache retrieval fails', async () => {
      const errorMsg = 'Cache retrieval failed';
      mockCache.hget.mockRejectedValue(new Error(errorMsg));

      await expect(roomTemperatureHandler.getRoomValveLevel('bedroom')).rejects.toThrow(errorMsg);
      expect(mockCache.hget).toHaveBeenCalledWith('bedroom', 'valuveLevel');
    });
  });

  describe('setValveLevel', () => {
    it('should set the valve level for the given room and value', async () => {
      const room = 'Living Room';
      const value = 80;

      await roomTemperatureHandler.setValveLevel(room, value);

      expect(mockCache.hset).toHaveBeenCalledWith(room, 'valuveLevel', '80');
      expect(mockValveController.setValveLevel).toHaveBeenCalledWith(room, value);
    });

    it('should throw an error if setting the valve level fails', async () => {
      const room = 'Living Room';
      const value = 80;
      const error = new Error('Set valve level failed');

      mockCache.hset.mockRejectedValueOnce(error);

      await expect(roomTemperatureHandler.setValveLevel(room, value)).rejects.toThrowError(error);

      expect(mockCache.hset).toHaveBeenCalledWith(room, 'valuveLevel', '80');
      expect(mockValveController.setValveLevel).not.toHaveBeenCalled();
    });
  });
});