import {TAspectName, ASPECT} from "./types";

type TPrimaryOrParents = {
    primary: boolean
} | {
    parents: [
        TAspectName,
        TAspectName
    ]
}

type TAspectData = Pick<TPrimaryOrParents, keyof TPrimaryOrParents> & {
    name: TAspectName
}

class AspectData implements TAspectData {
    readonly name: TAspectName;
    readonly primary?: boolean;
    readonly parents?: [TAspectName, TAspectName];

    constructor(name: TAspectName);
    constructor(name: TAspectName, parent1: TAspectName, parent2: TAspectName);

    constructor(name: TAspectName, parent1?: TAspectName, parent2?: TAspectName) {
        this.name = name;

        if(!parent1 || !parent2) {
            this.primary = true;
            return
        }

        this.primary = false;
        this.parents = [parent1, parent2]
    }
}

// const handler = {
//     get(target, property) {
//         console.log("getting", property);
//         return target[property];
//     },
// }
class AspectDataList {
    list: AspectData[];
    // proxy: ProxyHandler<any>
    constructor(aspectDataArray: AspectData[]) {
        this.list = aspectDataArray;
        // return new Proxy(this, handler)
    }
}

const list = new AspectDataList([
    new AspectData(ASPECT.ordo),
    new AspectData(ASPECT.ignis),
    new AspectData(ASPECT.aer),
    new AspectData(ASPECT.perditio),
    new AspectData(ASPECT.terra),
    new AspectData(ASPECT.gelum, ASPECT.ignis, ASPECT.perditio),
    new AspectData(ASPECT.lux, ASPECT.aer, ASPECT.ignis),
    new AspectData(ASPECT.motus, ASPECT.aer, ASPECT.ordo),
])



const aspects: Record<TAspectName, TAspectData> = {
    [ASPECT.ordo]: {
        primary: true,
    },
    [ASPECT.ignis] : {
        primary: true,
    },
    [ASPECT.aer] : {
        primary: true,
    },
    [ASPECT.aqua] : {
        primary: true,
    },
    [ASPECT.perditio] : {
        primary: true,
    },
    [ASPECT.terra] : {
        primary: true,
    },
    [ASPECT.gelum]: {
        parents: [
            ASPECT.ignis,
            ASPECT.perditio
        ]
    },
    [ASPECT.lux]: {
        parents: [
            ASPECT.aer,
            ASPECT.ignis
        ]
    },
    [ASPECT.motus]: {
        parents: [
            ASPECT.aer,
            ASPECT.ordo
        ]
    }
}
