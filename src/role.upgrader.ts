/** role.upgrader.js **/

import { roomPos } from './utils';
import { findAndEat} from './utils';
import { outOfTheWayPos0, energySource0Pos, MAIN_ROOM } from "./constants";
import {SmartCreep} from "./types";

export const roleUpgrader = {
    run: (creep: SmartCreep, creepIndex: number) => {
        if (creep.room.name !== MAIN_ROOM.roomName) {
            creep.moveTo(roomPos(MAIN_ROOM));
            return;
        }
        updateMemory(creep);

        if (creep.memory.keepUpgrading) {
            if (Math.abs(creep.pos.x - energySource0Pos.x) < 2 || Math.abs(creep.pos.y - energySource0Pos.y) < 2) {
                creep.moveTo(outOfTheWayPos0.x, outOfTheWayPos0.y);
            }
            if (creep.room.controller) {
                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00FF00'}});
                }
            }
        } else {
            findAndEat(creep, undefined, .5)
        }
    }
};

const updateMemory = (creep: SmartCreep) => {
    if (!creep.memory.keepUpgrading && creep.store.getFreeCapacity() === 0) {
        creep.memory.keepUpgrading = true;
    }
    if (creep.memory.keepUpgrading && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.keepUpgrading = false;
    }
}