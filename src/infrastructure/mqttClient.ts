import mqtt from 'mqtt';
import { IMqttClient } from '../interfaces';

export class MqttClient implements IMqttClient {
    private client: mqtt.MqttClient;

    constructor(private brokerUrl: string, private clientId: string) {
      this.client = mqtt.connect(this.brokerUrl, { clientId: this.clientId });
    }

    public async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
          this.client = mqtt.connect(this.brokerUrl);

          this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
            resolve();
          });

          this.client.on('error', (error) => {
            console.error('Error connecting to MQTT broker', error);
            reject(error);
          });
        });
      }

    public async subscribe(topic: string, options?: mqtt.IClientSubscribeOptions): Promise<void> {
        return new Promise((resolve, reject) => {
          this.client.subscribe(topic, options, (error, granted) => {
            if (error) {
              console.error(`Error subscribing to topic ${topic}`, error);
              reject(error);
            } else {
              console.log(`Subscribed to topic ${topic}`, granted);
              resolve();
            }
          });
        });
      }

    public async publish(topic: string, message: string, options?: mqtt.IClientPublishOptions): Promise<void> {
        return new Promise((resolve, reject) => {
          this.client.publish(topic, message, options, (error) => {
            if (error) {
              console.error(`Error publishing message to topic ${topic}`, error);
              reject(error);
            } else {
              console.log(`Published message to topic ${topic}`);
              resolve();
            }
          });
        });
      }

    public on(event: string, callback: (...args: any[]) => void): void {
        this.client.on(event, callback);
      }

    public unsubscribe(topic: string, options?: mqtt.IClientPublishOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.unsubscribe(topic, options, (error, granted) => {
              if (error) {
                console.error(`Error unsubscribing from topic ${topic}`, error);
                reject(error);
              } else {
                console.log(`UnSubscribed from topic ${topic}`, granted);
                resolve();
              }
            });
          });
    }

    public async disconnect(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        this.client.end(true, (err) => {
          if (err) {
            console.error(`Error disconnecting from MQTT broker at ${this.brokerUrl}:`, err);
            reject(err);
          } else {
            console.log(`Disconnected from MQTT broker at ${this.brokerUrl}`);
            resolve();
          }
        });
      });
    }
}
