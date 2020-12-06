import { Actuator, ActuatorAction, key } from '../shared/actuator';

export function getActuators() : Promise<Actuator[]> {
  return fetch('/api/actuators').then((r) => r.json());
}

export function allActuators(actuator: ActuatorAction) : Promise<any> {
  return fetch(`/api/actuators/all/${key(actuator)}`, { method: 'PUT' });
}

export function toggle(actuator: Actuator) : Promise<any> {
  return fetch(`/api/actuators/${actuator.id}/toggle`, { method: 'PUT' });
}
