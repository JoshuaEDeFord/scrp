/** populationControl.js **/
import {
    BIG_HARVESTER_ROLE,
    BUILDER_ROLE, HAULER_ROLE,
    LONG_RANGE_HARVESTER_ROLE,
    MARTYR_ROLE, PURE_HARVESTER_ROLE,
    SCOUT_ROLE,
    UPGRADER_ROLE
} from "./constants";
import {SmartCreep} from "./types";

// MOVE: 50
// CARRY: 50
// WORK: 100
// ATTACK: 80
// RANGED ATTACK: 150
// HEAL: 250
// CLAIM: 600
// TOUGH: 10

const BIG_HARVESTER_MIN = 0;
const BIG_HARVESTER_MAX = 2;

const BUILDER_MIN = 4;
const BUILDER_MAX = 20;

const SCOUT_MIN = 0;
const SCOUT_MAX = 0;

const LONG_RANGE_HARVESTER_MIN = 6;
const LONG_RANGE_HARVESTER_MAX = 8;

const PURE_HARVESTER_MIN = 3;
const PURE_HARVESTER_MAX = 3;

const HAULER_MIN = 6;
const HAULER_MAX = 6;

const UPGRADER_MIN = 6;
const UPGRADER_MAX = 10;


const SCOUT = [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE];
const BIG_HARVESTER = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
const BIG_HARVESTER_LITE = [WORK, CARRY, MOVE, MOVE, MOVE];
const LONG_RANGE_HARESTER = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
const LONG_RANGE_HARESTER_LITE = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
const PURE_HARVESTER = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE];
const PURE_HARVESTER_LITE = [WORK, WORK, MOVE];
const HAULER = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
const HAULER_LITE = [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
const UPGRADER = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
const UPGRADER_LITE = [WORK, CARRY, MOVE];
const BUILDER = [WORK, WORK, WORK, CARRY, CARRY, RANGED_ATTACK, MOVE, MOVE, MOVE];
const FAR_RANGE_HARESTER = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

export const adjustPopulation = (energyAailable: number) => {
    /*
    _.forEach(Game.creeps, (creep) => {
        if (creep.memory.role === BIG_HARVESTER_ROLE) {
            creep.memory.role = LONG_RANGE_HARVESTER_ROLE;
        }
    })
     */
    
    var bigHarvesters = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === BIG_HARVESTER_ROLE);
    var scouts = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === SCOUT_ROLE);
    var builders = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === BUILDER_ROLE);
    var longRangeHaresters = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === LONG_RANGE_HARVESTER_ROLE);
    var haulers = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === HAULER_ROLE);
    var pureHaresters = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === PURE_HARVESTER_ROLE);
    var upgraders = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === UPGRADER_ROLE);
    
    cullCreepRoles();

    // var consumersNeedingEnergy = Game.rooms[MAIN_ROOM].find(FIND_STRUCTURES, {
        // filter: (structure) => {
            // const needsEnergy = !structure.store || structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            // return needsEnergy;
        // }
    // });
    
    if (scouts.length < SCOUT_MIN) {
        spawn(`Scout`, SCOUT, SCOUT_ROLE);
    }

    // This bootstraps in case we get wiped out again
    if (bigHarvesters.length < BIG_HARVESTER_MIN || 
        (bigHarvesters.length <= BIG_HARVESTER_MAX && pureHaresters.length === 0 && energyAailable < 650)) {
        const result = spawn(`BigHarvester`, BIG_HARVESTER, BIG_HARVESTER_ROLE);
        if (result !== OK) {
            spawn(`Harvester`, BIG_HARVESTER_LITE, BIG_HARVESTER_ROLE);
        }
    }
    console.log(`
            Big harvesters: ${bigHarvesters.length}, 
            Builders: ${builders.length}, 
            Upgraders: ${upgraders.length}. 
            PureHarvesters: ${pureHaresters.length}. 
            Haulers: ${haulers.length}. 
            Long range harvesters: ${longRangeHaresters.length}. 
            Scouts: ${scouts.length}`
    ); 
    if (longRangeHaresters.length < LONG_RANGE_HARVESTER_MIN) {
        spawnHarester();
    } else {
        if (haulers.length < HAULER_MIN) {
            const result = spawn(`Hauler`, HAULER, HAULER_ROLE);
            if (result !== OK) {
                spawn(`Hauler Lite`, HAULER_LITE, HAULER_ROLE);
            }
        }
        if (pureHaresters.length < PURE_HARVESTER_MIN) {
            const result = spawn(`Pure Harvester`, PURE_HARVESTER, PURE_HARVESTER_ROLE);
            if (result !== OK) {
                const result = spawn(`Pure Harvester Lite`, PURE_HARVESTER_LITE, PURE_HARVESTER_ROLE);
            }
        }
        if (energyAailable < 1000) {
            return;
        }
        if (upgraders.length < UPGRADER_MIN) {
            // 750
            const result = spawn(`Upgrader`, UPGRADER, UPGRADER_ROLE);
            if (result !== OK) {
                spawn(`Upgrader`, UPGRADER_LITE, UPGRADER_ROLE);
            }
        }
        if (builders.length < BUILDER_MIN) {
            // 550
            spawn(`Builder`, BUILDER, BUILDER_ROLE);
        }
    }


    const spawn1 = Game.spawns['Spawn1'];
    if(spawn1.spawning) {
        console.log(`Spawning new creep: ${spawn1.spawning.name}`);
        var spawningCreep = Game.creeps[spawn1.spawning.name] as SmartCreep;
        spawn1.room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            spawn1.pos.x + 1,
            spawn1.pos.y - 1,
            {align: 'left', opacity: 0.8});
    }
}

const spawn = (namePrefix: String, bodyParts: BodyPartConstant[], role: String) => {
    var newName = namePrefix + Game.time.toString(10);
    return Game.spawns['Spawn1'].spawnCreep(bodyParts, newName,
        {memory: {role: role}});
}

const spawnHarester = () => {
    // 550
    let result = spawn(`LongRangeHarester`, LONG_RANGE_HARESTER, LONG_RANGE_HARVESTER_ROLE);
    if (result !== OK) {
        result = spawn(`BigHarvester`, LONG_RANGE_HARESTER_LITE, LONG_RANGE_HARVESTER_ROLE);
        if (result !== OK) {
            spawn(`Harvester`, BIG_HARVESTER_LITE, LONG_RANGE_HARVESTER_ROLE);
        }
    }
}

function cullCreepRoles() {
    cullCreeps(BIG_HARVESTER_ROLE, LONG_RANGE_HARVESTER_ROLE, BIG_HARVESTER_MAX);
    cullCreeps(LONG_RANGE_HARVESTER_ROLE, UPGRADER_ROLE, LONG_RANGE_HARVESTER_MAX);
    cullCreeps(UPGRADER_ROLE, BUILDER_ROLE, UPGRADER_MAX);
    cullCreeps(BUILDER_ROLE, MARTYR_ROLE, BUILDER_MAX);
    cullCreeps(SCOUT_ROLE, MARTYR_ROLE, SCOUT_MAX);
}

const cullCreeps = (role: string, upgradedRole: string, maxSize: number) => {
    const creeps = (<SmartCreep[]>Object.values(Game.creeps)).filter((creep: SmartCreep) => creep.memory.role === role);
    for (let i = 0; i < creeps.length - maxSize; i++) {
        const creep = creeps[i];
        if (upgradedRole) {
            creep.memory.role = upgradedRole;
        } else {
            creep.suicide();
        }
    }
}

