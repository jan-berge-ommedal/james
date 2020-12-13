import * as React from 'react';
import { useEffect, useState } from 'react';
import './app.less';
import moment from 'moment';
import { allActuators, onMessage, toggle } from './api';
import {
  Actuator, ActuatorAction, ActuatorState, actuatorActionKey,
} from '../shared/actuator';
import { Button } from './ui';
import {appEvent, appEventKey, HomeEvent} from '../shared/event';
import ToggleButton from './ui/toggleButton';

const ActuatorComponent: React.FC<{
    actuator: Actuator
}> = ({ actuator }) => (
  <div key={actuator.id}>
    <ToggleButton
      checked={actuator.state === ActuatorState.ON}
      onToggle={() => toggle(actuator)}
    >
      {actuator.name}
    </ToggleButton>
  </div>
);

const HomeEventComponent: React.FC<{
    homeEvent: HomeEvent,
    actuators: Actuator[]
}> = ({ homeEvent, actuators }) => {
  const { event } = homeEvent;

  let type;
  let description;
  if ('actuatorId' in event) {
    const { actuatorId } = event;
    const actuator = actuators.find((a) => a.id === actuatorId);

    type = actuatorActionKey(event.action);
    description = actuator && actuator.name;
  } else if ('type' in event) {
    type = appEventKey(event.type);
  }
  return (
    <tr key={homeEvent.id}>
      <td>{moment(homeEvent.timestamp).format('DD.MM.YY hh:mm:ss')}</td>
      <td>{type}</td>
      <td>{description}</td>
    </tr>
  );
};

export default () => {
  const [actuators, setActuators] = useState<{[key: string]: Actuator}>({});
  const [logEvents, setHomeEvents] = useState<HomeEvent[]>([]);

  useEffect(() => {
    onMessage((message) => {
      if ('name' in message) {
        setActuators((a) => ({ ...a, [message.id]: message }));
      } else if ('event' in message) {
        setHomeEvents((e) => [...e, message]);
      }
    });
  }, []);

  const values = Object.values(actuators);
  return (

    <div>
      <h1>James</h1>

      {values.map((a) => <ActuatorComponent key={a.id} actuator={a} />)}

      <hr />

      <Button onClick={() => allActuators(ActuatorAction.OFF)}>all off</Button>
      <Button onClick={() => allActuators(ActuatorAction.ON)}>all on</Button>
      <Button onClick={() => allActuators(ActuatorAction.TOGGLE)}>all toggle</Button>

      <hr />

      <h2>Events</h2>
      <table>
        <thead>

          <tr>
            <th>time</th>
            <th>type</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {logEvents.map((logEvent) => (
            <HomeEventComponent
              key={logEvent.id}
              homeEvent={logEvent}
              actuators={values}
            />
          ))}
        </tbody>

      </table>

    </div>

  );
};
