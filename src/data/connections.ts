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
    name: TAspectName,
}
type TAspectFullData = TAspectData & {
    connections: TAspectName[]
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

const createDataList = (aspectDataArray: AspectData[]) => {
    return aspectDataArray.reduce<Record<TAspectName, TAspectFullData>>((acc, aspectData) => {
        const {parents, name} = aspectData;
        const aspect = {
            ...aspectData,
            connections: parents?.length ? [...parents] : []
        }


        parents?.forEach(parentName => {
            if(!acc[parentName]) {
                return
            }
            acc[parentName].connections.push(name)
        })

        return {
            ...acc,
            [name]: aspect
        }
    }, {} as Record<TAspectName, TAspectFullData>)
}


const aspects = createDataList([
    new AspectData(ASPECT.ordo),
    new AspectData(ASPECT.ignis),
    new AspectData(ASPECT.aer),
    new AspectData(ASPECT.perditio),
    new AspectData(ASPECT.terra),
    new AspectData(ASPECT.aqua),

    new AspectData(ASPECT.gelum, ASPECT.ignis, ASPECT.perditio),
    new AspectData(ASPECT.lux, ASPECT.aer, ASPECT.ignis),
    new AspectData(ASPECT.motus, ASPECT.aer, ASPECT.ordo),
    new AspectData(ASPECT.permutatio, ASPECT.ordo, ASPECT.perditio),
    new AspectData(ASPECT.potentia, ASPECT.ignis, ASPECT.ordo),
    new AspectData(ASPECT.tempestas, ASPECT.aer, ASPECT.aqua),
    new AspectData(ASPECT.vacuos, ASPECT.aer, ASPECT.perditio),
    new AspectData(ASPECT.venenum, ASPECT.aqua, ASPECT.perditio),
    new AspectData(ASPECT.victus, ASPECT.aqua, ASPECT.terra),
    new AspectData(ASPECT.vitreus, ASPECT.ordo, ASPECT.terra),

    new AspectData(ASPECT.bestia, ASPECT.motus, ASPECT.victus),
    new AspectData(ASPECT.fames, ASPECT.vacuos, ASPECT.victus),
    new AspectData(ASPECT.herba, ASPECT.terra, ASPECT.victus),
    new AspectData(ASPECT.iter, ASPECT.motus, ASPECT.terra),
    new AspectData(ASPECT.limus, ASPECT.aqua, ASPECT.victus),
    new AspectData(ASPECT.metallum, ASPECT.terra, ASPECT.vitreus),
    new AspectData(ASPECT.mortuus, ASPECT.perditio, ASPECT.victus),
    new AspectData(ASPECT.praecantatio, ASPECT.potentia, ASPECT.vacuos),
    new AspectData(ASPECT.sano, ASPECT.ordo, ASPECT.victus),
    new AspectData(ASPECT.tenebrae, ASPECT.lux, ASPECT.vacuos),
    new AspectData(ASPECT.vinculum, ASPECT.motus, ASPECT.perditio),
    new AspectData(ASPECT.volatus, ASPECT.aer, ASPECT.motus),

    new AspectData(ASPECT.alienis, ASPECT.tenebrae, ASPECT.vacuos),
    new AspectData(ASPECT.arbor, ASPECT.aer, ASPECT.herba),
    new AspectData(ASPECT.auram, ASPECT.aer, ASPECT.praecantatio),
    new AspectData(ASPECT.corpus, ASPECT.bestia, ASPECT.mortuus),
    new AspectData(ASPECT.exanimis, ASPECT.mortuus, ASPECT.motus),
    new AspectData(ASPECT.spiritus, ASPECT.mortuus, ASPECT.victus),
    new AspectData(ASPECT.vitium, ASPECT.perditio, ASPECT.praecantatio),

    new AspectData(ASPECT.cognitio, ASPECT.ignis, ASPECT.spiritus),
    new AspectData(ASPECT.sensus, ASPECT.aer, ASPECT.spiritus),

    new AspectData(ASPECT.humanus, ASPECT.bestia, ASPECT.cognitio),

    new AspectData(ASPECT.instrumentum, ASPECT.humanus, ASPECT.ordo),
    new AspectData(ASPECT.lucrum, ASPECT.fames, ASPECT.humanus),
    new AspectData(ASPECT.messis, ASPECT.herba, ASPECT.humanus),
    new AspectData(ASPECT.perfodio, ASPECT.humanus, ASPECT.terra),

    new AspectData(ASPECT.fabrico, ASPECT.humanus, ASPECT.instrumentum),
    new AspectData(ASPECT.machina, ASPECT.instrumentum, ASPECT.motus),
    new AspectData(ASPECT.meto, ASPECT.instrumentum, ASPECT.messis),
    new AspectData(ASPECT.pannus, ASPECT.bestia, ASPECT.instrumentum),
    new AspectData(ASPECT.telum, ASPECT.instrumentum, ASPECT.ignis),
    new AspectData(ASPECT.tutamen, ASPECT.instrumentum, ASPECT.terra),
])

export default aspects;
