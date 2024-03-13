/** role.martyr.js **/
import {MAIN_ROOM} from "./constants";
import {SmartCreep} from "./types";

export const roleMartyr = {

    /** @param {Creep} creep **/
    run: (creep: SmartCreep, idx: number) => {
        if (creep.room.name === MAIN_ROOM.roomName) {
            var storage = creep.room.storage;

            if (storage) {
                const result = creep.transfer(storage, RESOURCE_ENERGY);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (result === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.suicide();
                }
            }
        } else {
            creep.moveTo(new RoomPosition(38, 9, MAIN_ROOM.roomName), {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};