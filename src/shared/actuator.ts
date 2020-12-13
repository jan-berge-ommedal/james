

export enum ActuatorAction {
    ON ,
    OFF,
    TOGGLE
}

export enum ActuatorState {
    UNKNOWN,
    OFF,
    ON
}

export interface Actuator {
    id: string,
    name: string,
    state: ActuatorState
}

export interface Actuate {
    actuatorId?: string,
    action: ActuatorAction
}

export type ActuatorActionKey = keyof typeof ActuatorAction

export function actuatorAction(action: ActuatorActionKey): ActuatorAction {
  return ActuatorAction[action];
}

export function actuatorActionKey(action: ActuatorAction): ActuatorActionKey {
    return ActuatorAction[action] as ActuatorActionKey;
}
