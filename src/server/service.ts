import { connect } from 'mqtt';
import { schedule } from 'node-cron';
import { Actuator, ActuatorAction, ActuatorState } from '../shared/actuator';
import { AppEventType, HomeEvent } from '../shared/event';
import { addEvent } from './events';
import { createObservable } from '../shared/observable';

const observable = createObservable<Actuator>();
export const onActuator = observable.on;

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

interface MQTTDevice {
    ieeeAddr: string,
    friendly_name: string
}

interface MQTTState {
    state: string
}

const actuators: { [key: string]: Actuator } = {};
client.subscribe('zigbee2mqtt/bridge/config/devices', { qos: 1 }, console.log);

function subscribe(topic: string, onSubscribed?: () => void) {
  console.log(`subscribing to: ${topic}`);
  client.subscribe(topic, onSubscribed);
}

client.on('connect', () => {
  console.log('connected to mqtt');

  subscribe('zigbee2mqtt/bridge/config/devices', () => {
    publish('zigbee2mqtt/bridge/config/devices/get', '');
  });
});

function receivedDevices(devices: MQTTDevice[]) {
  devices.filter((d) => d.friendly_name !== 'Coordinator').map((d): Actuator => ({
    id: d.ieeeAddr,
    name: d.friendly_name,
    state: ActuatorState.UNKNOWN,
  })).forEach((a) => {
    actuators[a.id] = a;
    // subscribe(`zigbee2mqtt/${a.id}`);
    subscribe(`zigbee2mqtt/${a.name}`);
  });
  console.log(`actuators updated (${Object.keys(actuators).length})`);
}

function mapState(state: MQTTState) {
  switch (state.state) {
    case 'OFF':
      return ActuatorState.OFF;
    case 'ON':
      return ActuatorState.ON;
    default:
      return ActuatorState.UNKNOWN;
  }
}

function receivedActuatorState(actuator: Actuator, state: MQTTState) {
  const { id } = actuator;
  const updatedActuator = { ...actuator, state: mapState(state) };
  actuators[id] = updatedActuator;
  observable.publish(updatedActuator);
}

client.on('message', (topic, payload) => {
  const json = payload.toString();
  console.log(`${topic} << ${json}`);
  const parse = JSON.parse(json);
  switch (topic) {
    case 'zigbee2mqtt/bridge/config/devices':
      return receivedDevices(parse);
    default:

      if (topic.startsWith('zigbee2mqtt/')) {
        const actuatorName = topic.substr(12);
        const actuator = Object.values(actuators).find((a) => a.name === actuatorName);
        if (actuator) {
          return receivedActuatorState(actuator, parse);
        }
      }
      console.log(`received message on unknown topic: ${topic}`);
      return null;
  }
});

export function getActuators() : Actuator[] {
  return Object.values(actuators);
}

function actuatorEvent(actuatorId: string, action: ActuatorAction) {
  addEvent({
    action,
    actuatorId,
  });
}

export function read(actuatorId: string) {
  publish(`zigbee2mqtt/${actuatorId}/get`, { state: '' });
}

export function readAll() {
  Object.keys(actuators).forEach((actuatorId) => {
    read(actuatorId);
  });
}

export function toggle(id: string) {
  actuatorEvent(
    id,
    ActuatorAction.TOGGLE,
  );
  publish(`zigbee2mqtt/${id}/set`, {
    state: 'TOGGLE',
  });
}

export function on(id: string) {
  actuatorEvent(
    id,
    ActuatorAction.ON,
  );
  publish(`zigbee2mqtt/${id}/set`, {
    state: 'ON',
  });
}

export function off(id: string) {
  actuatorEvent(
    id,
    ActuatorAction.OFF,
  );
  publish(`zigbee2mqtt/${id}/set`, {
    state: 'OFF',
  });
}

export function allToggle() {
  console.log('all toggle');
  Object.keys(actuators).forEach(toggle);
}

export function allOn() {
  console.log('all on');
  Object.keys(actuators).forEach(on);
}

export function allOff() {
  console.log('all off');
  Object.keys(actuators).forEach(off);
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
