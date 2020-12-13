import { v4 as uuidv4 } from 'uuid';
import { AppEventType, Event, HomeEvent } from '../shared/event';
import { createObservable } from '../shared/observable';

const observable = createObservable<HomeEvent>();
export const onEvent = observable.on;

const events: HomeEvent[] = [];

export function addEvent(event: Event) {
  const ev = {
    id: uuidv4(),
    timestamp: Date.now(),
    event,
  };
  events.push(ev);
  observable.publish(ev);
}

export function getEvents() {
  return events;
}

addEvent({
  type: AppEventType.BOOT,
});
