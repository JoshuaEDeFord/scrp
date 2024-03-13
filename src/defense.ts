/** defense.js **/
import {MAIN_ROOM} from "./constants";

export const defend = () => {
    const mainRoom = Game.rooms[MAIN_ROOM.roomName];

    const towers: StructureTower[] = mainRoom.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_TOWER }
    }) as StructureTower[];
    
    towers.forEach((tower: StructureTower) => {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
        }
    });
}

export const creepDefend = (creep: Creep) => {
    const rangedAttackPart = creep.body.filter(part => part.type === RANGED_ATTACK);
    if (rangedAttackPart.length === 0) {
        return false;
    }
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        const attackResult = creep.rangedAttack(target);
        if (attackResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    } else {
        return false;
    }
}