export interface RoomSpec {
    x: number;
    y: number;
    roomName: string;
}

export interface SmartCreep extends Omit<Creep, 'memory'> {
    memory: SmartCreepMemory;
}

export interface SmartCreepMemory extends CreepMemory {
    creepIndex?: number;
    targetTrash?: Record<string, Id<Resource<ResourceConstant>>>;
    favoriteRoom: RoomSpec;
    keepTransferring?: boolean;
    keepBuilding?: boolean;
    role?: string;
    keepUpgrading?: boolean;
    target?: {
        type: string;
        idx: number;
    };
}

export interface NeedyStructures {
    towersNeedingEnergy: StructureTower[];
    structuresNeedingRepair: AnyStructure[];
    containersNeedingRepair: StructureContainer[];
    constructionSites: ConstructionSite[];
}