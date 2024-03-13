import {SmartCreep} from "./types";
import {MAIN_ROOM} from "./constants";

/** role.harester.js **/
import {transferToStorage, roomPos} from "./utils";

export const roleHarvester = {

    /** @param {Creep} creep **/
    run: (creep: SmartCreep, idx: number) => {
        if (creep.room.name !== MAIN_ROOM.roomName) {
            creep.moveTo(roomPos(MAIN_ROOM));
            return;
        }
        if (!creep.memory.keepTransferring && creep.store.getFreeCapacity() === 0) {
            creep.memory.keepTransferring = true;
        }
        if (creep.memory.keepTransferring && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.keepTransferring = false;
        }
        
        if(creep.memory.keepTransferring) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure: StructureExtension | StructureSpawn) => {
                    const needsEnergy = !structure.store || structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    if (!needsEnergy) {
                        return false;
                    }
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN);
                }
            }) as Array<StructureExtension | StructureSpawn>;
            // Prioritize spawn over extensions
            const needySpawn = targets.find((s) => s.structureType === STRUCTURE_SPAWN);
            const target = needySpawn || targets[0];
            if(target) {
                let xferResult = creep.transfer(target, RESOURCE_ENERGY);
                if(xferResult === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.say(`H: ${xferResult}`);
                }
            } else {
                creep.say(`FULL`);
                transferToStorage(creep, creep.room)
            }
        } else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[sources.length - 1]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sources.length - 1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};