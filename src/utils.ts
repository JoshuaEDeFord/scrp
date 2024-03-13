import {RoomSpec} from "./types";

export const roomPos = (roomSpec: RoomSpec) => {
    return new RoomPosition(roomSpec.x, roomSpec.y, roomSpec.roomName)
}

export const withdrawFromNearestStorage = (creep: Creep) => {
    var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_STORAGE) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (source) {
        if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    } else {
        return false;
    }
}

export const transferToStorage = (creep: Creep, room: Room) => {
    var storage = room.storage;

    if (storage) {
        const result = creep.transfer(storage, RESOURCE_ENERGY);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

export const findAndEat = (creep: Creep, idx?: number, opacity?: number) => {
    const success = exports.withdrawFromNearestStorage(creep);
    if (!success) {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[idx !== undefined ? idx : sources.length - 1]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[idx !== undefined ? idx : sources.length - 1], {visualizePathStyle: {stroke: '#ffaa00', lineStyle: 'solid', opacity}});
        }
    }
}

