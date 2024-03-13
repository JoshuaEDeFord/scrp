/** role.hauler.js **/
import {SmartCreep} from "./types";

export const roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep: SmartCreep, idx: number) {
        updateMemory(creep);
        
        if (creep.memory.keepTransferring) {
            // Find structures that need energy and transfer it
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure: StructureExtension | StructureSpawn) => {
                    const needsEnergy = !structure.store || structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    if (!needsEnergy) {
                        return false;
                    }
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN);
                }
            }) as Array<StructureExtension | StructureSpawn>;
            const target = targets[0];
            if(target) {
                let xferResult = creep.transfer(target, RESOURCE_ENERGY);
                if(xferResult === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.say(`H: ${xferResult}`);
                }
            } else {
                creep.say(`FULL`);
                var storage = creep.room.storage;

                if(storage) {
                    const result = creep.transfer(storage, RESOURCE_ENERGY);
                    if(result === ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        } else {
            // Find trash and pick it up
            if (creep.memory.targetTrash === undefined) {
                // Find trash that no other creep is targeting and target it
                const trash = creep.room.find(FIND_DROPPED_RESOURCES);
                const allCreeps = Object.values(Game.creeps) as SmartCreep[]
                const targetTrashIds = new Set(allCreeps.filter(c => c.memory.targetTrash).map(c => c.memory.targetTrash!.id));
                const orphanTrash = trash.find(t => !targetTrashIds.has(t.id));
                if (orphanTrash) {
                    creep.memory.targetTrash = {id: orphanTrash.id};
                }
            }
            if (creep.memory.targetTrash) {
                const targetTrash = Game.getObjectById(creep.memory.targetTrash.id);
                if (!targetTrash) { // The trash has already been picked up. Forget it for now.
                    delete creep.memory.targetTrash;
                    return;
                }
                if (creep.pickup(targetTrash) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTrash, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

function updateMemory(creep: SmartCreep) {
    if (!creep.memory.keepTransferring && creep.store.getFreeCapacity() === 0) {
        creep.memory.keepTransferring = true;
    }
    if (creep.memory.keepTransferring && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.keepTransferring = false;
    }
}