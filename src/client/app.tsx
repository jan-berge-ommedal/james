import * as React from 'react';
import { useEffect, useState } from 'react';
import './app.less';
import { allActuators, getActuators, toggle } from './api';
import { Actuator, ActuatorAction } from '../shared/actuator';

const ActuatorComponent : React.FC<{
    actuator: Actuator
}> = ({ actuator }) => (<div key={actuator.id}><button type="button" onClick={() => toggle(actuator)}>{actuator.name}</button></div>);

export default () => {
  const [actuators, setActuators] = useState<Actuator[]>([]);

  useEffect(() => {
    getActuators().then(setActuators);
  }, []);

  return (

    <div>
      <h1>James</h1>

      {actuators.map((a) => <ActuatorComponent key={a.id} actuator={a} />)}

      <button type="button" onClick={() => allActuators(ActuatorAction.OFF)}>all off</button>
      <button type="button" onClick={() => allActuators(ActuatorAction.ON)}>all on</button>
      <button type="button" onClick={() => allActuators(ActuatorAction.TOGGLE)}>all toggle</button>

    </div>

  );
};
