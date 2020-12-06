import * as express from 'express';
import {allOff, allOn, allToggle, getActuators, toggle,} from './service';
import {action, ActuatorAction, ActuatorActionKey} from '../shared/actuator';

const api: express.Router = express.Router();


api.route('/actuators')
    .get((req, res) => {
        res.json(getActuators());
    });


api.route('/actuators/all/:action')
    .put((req, res) => {
        res.json({});
        const actionKey = req.params.action as ActuatorActionKey;
        switch (action(actionKey)) {
            case ActuatorAction.OFF:
                return allOff();
            case ActuatorAction.ON:
                return allOn();
            case ActuatorAction.TOGGLE:
                return allToggle();
            default:
                console.log(`unknown action: ${actionKey}`)
                return '';
        }
    });


api.route('/actuators/:id/:action')
    .put((req, res) => {
        res.json({});
        toggle(req.params.id);
    });


export default api;
