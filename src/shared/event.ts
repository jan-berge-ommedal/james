import { ActuatorAction } from './actuator';

export interface ActuatorEvent {
    action: ActuatorAction,
    actuatorId: string
}

export enum AppEventType {
    BOOT
}
export interface AppEvent {
    type: AppEventType,
}

export type Event = ActuatorEvent | AppEvent;

export interface HomeEvent {
    id: string,
    timestamp: number,
    event: Event
}

export type AppEventTypeKey = keyof typeof AppEventType

export function appEvent(action: AppEventTypeKey): AppEventType {
    return AppEventType[action];
}

export function appEventKey(action: AppEventType): AppEventTypeKey {
    return AppEventType[action] as AppEventTypeKey;
}
