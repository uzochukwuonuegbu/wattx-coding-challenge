import { HeatingSystemController } from './controllers/heatingSystem.controller';
import { MqttServer } from './infrastructure/mqttServer';
import { SensorDataType } from "./interfaces";

import cors from "cors";
import app from "./app";

app.use(cors());

const mqttServer = new MqttServer();
mqttServer.start();

const PORT = process.env.PORT || 3000;
app.listen(
  PORT, () => {
    console.log(`web server running at ${PORT}`);
  });




// simulating periodic sensor events
const ctrl = new HeatingSystemController();
setInterval(async () => {
    await ctrl.sensorValuePublisher({
        sensorID: 'sensor-1',
        type: SensorDataType.TEMPERATURE,
        value: Math.random() * 10 + 20
      });
  }, 5000);
