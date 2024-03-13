/** role.pureHarvester.js **/
import {SmartCreep} from "./types";

export const rolePureHarvester = {

    /** @param {Creep} creep **/
    run: (creep: SmartCreep, idx: number) => {
        const sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[sources.length - 1]) === ERR_NOT_IN_RANGE) {
            console.log(`Moving to source`)
            creep.moveTo(sources[sources.length - 1], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};