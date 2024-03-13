/** role.longRangeHarvester.js **/
import {SmartCreep} from "./types";
import { roomPos, transferToStorage } from './utils';
import {MAIN_ROOM, targetRooms} from "./constants";

export const roleHarvester = {

    /** @param {Creep} creep **/
    run: (creep: SmartCreep, idx: number) => {
        updateMemory(creep, idx);

        if(creep.memory.keepTransferring) {
            if (creep.room.name !== MAIN_ROOM.roomName) {
                creep.moveTo(roomPos(MAIN_ROOM));
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure: StructureTower | StructureExtension | StructureSpawn) => {
                        const needsEnergy = !structure.store || structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        if (!needsEnergy) {
                            return false;
                        }
                        return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN);
                    }
                }) as Array<StructureTower | StructureExtension | StructureSpawn>;
                const target = targets[0];
                if (target) {
                    creep.say(`LH: xfer`);
                    let xferResult = creep.transfer(target, RESOURCE_ENERGY);
                    if (xferResult === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                    } else {
                        creep.say(`LH: ${xferResult}`);

                    }
                } else {
                    transferToStorage(creep, creep.room)
                }
            }
        } else {
            const fav = creep.memory.favoriteRoom;
            if (creep.room.name !== fav.roomName) {
                const result = creep.moveTo(roomPos(fav), {visualizePathStyle: {stroke: '#ffffff'}});
                console.log(`Moving to ${fav.roomName}: ${result}`)
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[sources.length - 1]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[sources.length - 1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

const updateMemory = (creep: SmartCreep, idx: number) => {
    if (!creep.memory.favoriteRoom) {
        creep.memory.favoriteRoom = targetRooms[idx % targetRooms.length]
    }
    if (!creep.memory.keepTransferring && creep.store.getFreeCapacity() === 0) {
        creep.memory.keepTransferring = true;
    }
    if (creep.memory.keepTransferring && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.keepTransferring = false;
    }
}