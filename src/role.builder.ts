/** role.builder.js **/

import { roomPos, withdrawFromNearestStorage, findAndEat } from './utils';
import {NeedyStructures, SmartCreep} from "./types";
import {
    CONSTRUCTION_TYPE_BUILD,
    CONSTRUCTION_TYPE_REPAIR,
    CONSTRUCTION_TYPE_TOWER,
    MAIN_ROOM,
    targetRooms
} from "./constants";

export const roleBuilder = {

    /** @param {Creep} creep **/
    run: (creep: SmartCreep, idx: number) => {
        // creep.say(`🔨`);
        if (!creep.memory.keepBuilding && creep.store.getFreeCapacity() === 0) {
            creep.memory.keepBuilding = true;
        }
        if (creep.memory.keepBuilding && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.keepBuilding = false;
            delete creep.memory.target;
        }

        if(creep.memory.keepBuilding) {

            const { towersNeedingEnergy, structuresNeedingRepair, containersNeedingRepair, constructionSites } = getStructuresThatNeedAttention(false);
            const repairTargets = containersNeedingRepair.length > 0 ? containersNeedingRepair : structuresNeedingRepair;

            console.log(`Towers needing energy: ${towersNeedingEnergy.length}, structures needing repair: ${structuresNeedingRepair.length}, containers needing repair: ${containersNeedingRepair.length}, constructionSites: ${constructionSites.length}`)

            // Prioritize hiDollarSites
            const hiDollarSites = constructionSites.filter((site: ConstructionSite) => {
                return site.structureType === STRUCTURE_EXTENSION || site.structureType === STRUCTURE_TOWER || site.structureType === STRUCTURE_LINK ;
            }) as Array<ConstructionSite>;
            const buildTargets = hiDollarSites.length ? hiDollarSites : constructionSites;
            if (towersNeedingEnergy.length > 0) {
                doBuild(creep, towersNeedingEnergy, creep.transfer, CONSTRUCTION_TYPE_TOWER);
            } else if(buildTargets.length > 0) {
                doBuild(creep, buildTargets, creep.build, CONSTRUCTION_TYPE_BUILD);
            } else if(repairTargets.length > 0) {
                doBuild(creep, repairTargets, creep.repair, CONSTRUCTION_TYPE_REPAIR);
            } 
        } else {
            findAndEat(creep, 0, 1);
            /*
            var sources = creep.room.find(FIND_SOURCES);
            const harvestResult = creep.harvest(sources[sources.length - 1]);
            if (harvestResult === ERR_NOT_IN_RANGE) {
                const result = creep.moveTo(sources[sources.length - 1], {visualizePathStyle: {stroke: '#ffaa00'}});
                if (result != OK) {
                    creep.say(`?? ${result}`);
                    console.log(`Builder ${creep.name} failed to move to source: ${result}`);
                }
            } else if (harvestResult !== OK) {
                creep.say(`🍔 ${harvestResult}`);
            }
             */
        }
    }
};

const doBuild = (
    creep: SmartCreep,
    buildTargets: ConstructionSite[] | AnyStructure[],
    buildFunc: ((target: ConstructionSite) => CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH) |
        ((target: Structure) => CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES) |
        ((target: (AnyCreep | Structure), resourceType: ResourceConstant, amount?: number) => ScreepsReturnCode),
    type: string) => {
    let targetIdx = 0;
    if (creep.memory.target === undefined) {
        targetIdx = Math.floor(Math.random() * buildTargets.length);
        creep.memory.target = {idx: targetIdx, type};
    } else {
        const target = creep.memory.target;
        if (target && target.type === type) {
            targetIdx = creep.memory.target.idx;
        }
    }

    if (!buildTargets[targetIdx]) {
        delete creep.memory.target;
    } else {
        // @ts-ignore  This causes a TS error, but this function is useful for both build and repair and shouldn't be duplicated.
        const buildResult = buildFunc.call(creep, buildTargets[targetIdx], RESOURCE_ENERGY);
        if (buildResult === ERR_NOT_OWNER) {
            creep.say("B: NO");
        }
        if (buildResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(buildTargets[targetIdx], {visualizePathStyle: {stroke: '#ff0000'}});
        }
    }
    return targetIdx;
}

const getStructuresThatNeedAttention = (includeWalls: boolean) => {
    const structures: NeedyStructures = {towersNeedingEnergy: [], structuresNeedingRepair: [], containersNeedingRepair: [], constructionSites: []};
    for (const roomSpec of [...targetRooms, MAIN_ROOM]) {
        const room = Game.rooms[roomSpec.roomName];
        if (room) {
            const towersNeedingEnergy = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType === STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0}) as StructureTower[]
            const structuresNeedingRepair = room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}).filter((structure) => {
                return includeWalls || structure.structureType !== STRUCTURE_WALL;
            });
            const containersNeedingRepair = structuresNeedingRepair.filter((s) => s.structureType === STRUCTURE_CONTAINER) as StructureContainer[]
            const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            
            structures.towersNeedingEnergy.push(...towersNeedingEnergy);
            structures.structuresNeedingRepair.push(...structuresNeedingRepair);
            structures.containersNeedingRepair.push(...containersNeedingRepair);
            structures.constructionSites.push(...constructionSites);
        }
    }
    return structures;
}

// Rules
// 1. If there are towers needing energy, fill them up
// 2. If there are construction sites, build them
// 3. If there are structures needing repair, repair them