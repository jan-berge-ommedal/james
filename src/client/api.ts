import { Actuator, ActuatorAction } from '../shared/actuator';
import { ClientMessage, ServerMessage } from '../shared/api';

type MessageHandler = (message: ServerMessage) => void

const callbacks: MessageHandler[] = [];

let ws : WebSocket;
function connect() {
  ws = new WebSocket(`ws://${window.location.host}/ws`);
  ws.onmessage = (ev) => {
    const message = JSON.parse(ev.data);
    callbacks.forEach((m) => m(message));
  };

  ws.onclose = (e) => {
    console.log(e);
    setTimeout(() => {
      connect();
    }, 1000);
  };

  ws.onerror = (err) => {
    console.error(err);
    ws.close();
  };
}
connect();

export function onMessage(callback: MessageHandler) {
  callbacks.push(callback);
}

function sendMessage(message: ClientMessage) {
  if (ws) {
    ws.send(JSON.stringify(message));
  }
}

export function allActuators(action: ActuatorAction) {
  sendMessage({
    action,
  });
}

export function toggle(actuator: Actuator) {
  sendMessage({
    actuatorId: actuator.id,
    action: ActuatorAction.TOGGLE,
  });
}
