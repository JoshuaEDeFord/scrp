/** main.js **/

const {roleBuilder} = require('./role.builder');
import {SmartCreep} from "./types";
import {
    BIG_HARVESTER_ROLE,
    BUILDER_ROLE,
    HAULER_ROLE, LONG_RANGE_HARVESTER_ROLE, MAIN_ROOM,
    MARTYR_ROLE,
    PURE_HARVESTER_ROLE,
    SCOUT_ROLE,
    UPGRADER_ROLE
} from "./constants";
const roleHarvester = require('role.harvester');
const rolePureHarvester = require('role.pureHarvester');
const roleHauler = require('role.hauler');
const roleLongRangeHarvester = require('role.longRangeHarvester');
const roleMartyr = require('role.martyr');
const roleScout = require('role.scout');
const roleUpgrader = require('role.upgrader');

const adjustPopulation = require('populationControl');
const { defend, creepDefend } = require('defense');

module.exports.loop = function () {
    for(var name in Game.rooms) {
        const energyAvailable = Game.rooms[name].energyAvailable;
        console.log('Room "'+name+'" has '+ energyAvailable+' energy');
    }

    adjustPopulation(Game.rooms[MAIN_ROOM.roomName].energyAvailable);
    defend();
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    let idx = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name] as SmartCreep;
        if (creep.memory.creepIndex === undefined) {
            creep.memory.creepIndex = idx;
        }
        if(creep.memory.role === MARTYR_ROLE) {
            if (!creepDefend(creep)) {
                roleMartyr.run(creep, creep.memory.creepIndex);
            }
        }
        if(creep.memory.role === SCOUT_ROLE) {
            if (!creepDefend(creep)) {
                roleScout.run(creep, creep.memory.creepIndex);
            }
        }
        if(creep.memory.role === BIG_HARVESTER_ROLE) {
            if (!creepDefend(creep)) {
                roleHarvester.run(creep, creep.memory.creepIndex);
            }
        }
        if(creep.memory.role === LONG_RANGE_HARVESTER_ROLE) {
            if (!creepDefend(creep)) {
                roleLongRangeHarvester.run(creep, creep.memory.creepIndex);
            }
        }
        if(creep.memory.role === UPGRADER_ROLE) {
            if (!creepDefend(creep)) {
                roleUpgrader.run(creep, creep.memory.creepIndex);
            }
        }
        if(creep.memory.role === PURE_HARVESTER_ROLE) {
            if (!creepDefend(creep)) {
                rolePureHarvester.run(creep, creep.memory.creepIndex);
            }
        }
        if(creep.memory.role === HAULER_ROLE) {
            if (!creepDefend(creep)) {
                roleHauler.run(creep, creep.memory.creepIndex);
            }
        }
        if(creep.memory.role === BUILDER_ROLE) {
            if (!creepDefend(creep)) {
                roleBuilder.run(creep, creep.memory.creepIndex);
            }
        }
        idx += 1;
    }
}