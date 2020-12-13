import { Actuate, Actuator } from './actuator';
import { HomeEvent } from './event';

export type ServerMessage = Actuator | HomeEvent
export type ClientMessage = Actuate
