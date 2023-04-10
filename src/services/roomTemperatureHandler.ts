import { generalConfig } from '../config';
import { ICache, IRoomTemperatureHandler, IValveController } from '../interfaces';

export class RoomTemperatureHandler implements IRoomTemperatureHandler {
  private cozyTempLevel: number;

  constructor(
    private config: typeof generalConfig,
    private valveController: IValveController,
    private cache: ICache
  ) {
    this.cozyTempLevel = Number(this.config.cozyTemperature);
  }

  public async adjustValve(room: string, temperature: number): Promise<number> {
    try {
      const currentValveLevel = await this.getRoomValveLevel(room);
      const adjustedValve = this.calculateValveLevel(temperature, currentValveLevel);
      await this.setValveLevel(room, adjustedValve);
      return adjustedValve;
    } catch(error) {
      throw error;
    }
  }

  private calculateValveLevel(temperature: number, currentValveLevel: number): number {
    let valveLevel = currentValveLevel;
    if (temperature < this.cozyTempLevel) {
      valveLevel = Math.min(100, valveLevel + 10);
    } else {
      valveLevel = Math.max(0, valveLevel - 10);
    }
    return valveLevel;
  }

  private async getRoomValveLevel(room: string): Promise<number> {
    try {
      const cachedValveLevel = await this.cache.hget(room, 'valuveLevel');
      return cachedValveLevel ? Number(cachedValveLevel) : Number(this.config.defaultValveLevel);
    } catch(error) {
      throw error;
    }
  }

  private async setValveLevel(room: string, value: number): Promise<void> {
    try {
      await this.cache.hset(room, 'valuveLevel', value.toString());
      this.valveController.setValveLevel(room, value);
    } catch(error) {
      throw error;
    }
  }
}