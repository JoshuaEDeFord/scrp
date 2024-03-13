/** role.scout.js **/
import {SOUTH_ROOM1} from "./constants";
import {SmartCreep} from "./types";

const { roomPos } = require('utils');
export const roleScout = {

    /** @param {Creep} creep **/
    run: (creep: SmartCreep, idx: number) => {
        creep.say(`Scout`);
        if (creep.room.name !== SOUTH_ROOM1.roomName) {
            console.log(`Scout creep ${creep.name} is moving to south room`);
            creep.moveTo(roomPos(SOUTH_ROOM1));
        } else {
            console.log(`Scout creep ${creep.name} is in south room`);
            if (creep.room.controller) {
                let result = creep.claimController(creep.room.controller);

                if (result !== OK) {
                    console.log(`Error claming controller: ${result}`);
                    creep.say(`Scout D`);
                } else {
                    creep.say(`:)`);
                }

                if (result !== OK) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};