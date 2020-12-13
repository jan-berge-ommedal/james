import { connect } from 'mqtt';
import { schedule } from 'node-cron';
import { Actuator } from '../shared/actuator';

const mqttBrokerUrl = 'mqtt://pi.lan';
console.log(`connecting to: ${mqttBrokerUrl}`);
const client = connect(mqttBrokerUrl);

function stringify(message: any) {
  if (typeof message === 'string') {
    return message;
  }
  return JSON.stringify(message);
}

function publish(topic: string, message: any) {
  const string = stringify(message);
  console.log(`${topic} >> ${string}`);
  client.publish(topic, string);
}

interface Device {
    ieeeAddr: string,
    friendly_name: string
}

let actuators: Actuator[];
client.subscribe('zigbee2mqtt/bridge/config/devices', { qos: 1 }, console.log);

client.on('connect', () => {
  console.log('connected to mqtt');

  client.subscribe('zigbee2mqtt/bridge/config/devices', () => {
    publish('zigbee2mqtt/bridge/config/devices/get', '');
  });
});

function receivedDevices(devices: Device[]) {
  actuators = devices.filter((d) => d.friendly_name !== 'Coordinator').map((d) => ({
    id: d.ieeeAddr,
    name: d.friendly_name,
  }));
  console.log(`actuators updated (${actuators.length})`);
}

client.on('message', (topic, payload) => {
  const json = payload.toString();
  const parse = JSON.parse(json);
  switch (topic) {
    case 'zigbee2mqtt/bridge/config/devices':
      return receivedDevices(parse);
    default:
      console.log('received message on unknown topic!');
      return null;
  }
});

export function getActuators() {
  return actuators;
}

export function toggle(id: string) {
  publish(`zigbee2mqtt/${id}/set`, {
    state: 'TOGGLE',
  });
}

export function on(id: string) {
  publish(`zigbee2mqtt/${id}/set`, {
    state: 'ON',
  });
}

export function off(id: string) {
  publish(`zigbee2mqtt/${id}/set`, {
    state: 'OFF',
  });
}

export function allToggle() {
  console.log('all toggle');
  actuators.map((a) => a.id).forEach(toggle);
}

export function allOn() {
  console.log('all on');
  actuators.map((a) => a.id).forEach(on);
}

export function allOff() {
  console.log('all off');
  actuators.map((a) => a.id).forEach(off);
}

// schedule('*/5 * * * * *', () => {
//   allToggle();
// });

schedule('0 0 6,15 * * *', () => {
  allOn();
});

schedule('0 0 0,10 * * *', () => {
  allOff();
});
