import WebSocket from 'ws';
import {
  allOff, allOn, allToggle, getActuators, off, on, onActuator, readAll, toggle,
} from './service';
import { ActuatorAction } from '../shared/actuator';
import { onEvent, getEvents } from './events';
import { ServerMessage } from '../shared/api';

const sockets : WebSocket[] = [];

function send(data: ServerMessage, ws: WebSocket) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function sendToAll(ev: ServerMessage) {
  sockets.forEach((s) => {
    send(ev, s);
  });
}

onEvent(sendToAll);
onActuator(sendToAll);

function handle(message: any) {
  if ('action' in message) {
    const { actuatorId, action } = message;
    switch (action) {
      case ActuatorAction.OFF:
        return actuatorId ? off(actuatorId) : allOff();
      case ActuatorAction.ON:
        return actuatorId ? on(actuatorId) : allOn();
      case ActuatorAction.TOGGLE:
        return actuatorId ? toggle(actuatorId) : allToggle();
      default:
        console.log(`unknown action: ${message}`);
    }
  }
  return undefined;
}

export function newWebSocketClient(ws: WebSocket) {
  console.log('new websocket client');
  sockets.push(ws);

  getActuators().forEach((a) => {
    send(a, ws);
  });

  getEvents().forEach((e) => {
    send(e, ws);
  });

  readAll();

  ws.on('message', (data) => {
    console.log('api message:', data);
    if (typeof data === 'string') {
      try {
        handle(JSON.parse(data));
      } catch (e) {
        console.error(e);
      }
    }
  });
}
