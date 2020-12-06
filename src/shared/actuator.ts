

export enum ActuatorAction {
    ON ,
    OFF,
    TOGGLE
}

export interface Actuator {
    id: string,
    name: string
}

export type ActuatorActionKey = keyof typeof ActuatorAction

export function action(action: ActuatorActionKey): ActuatorAction {
  return ActuatorAction[action];
}

export function key(action: ActuatorAction): ActuatorActionKey {
    return ActuatorAction[action] as ActuatorActionKey;
}
