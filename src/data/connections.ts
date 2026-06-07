import {TAspect, EAspect} from "./types";

type TPrimaryOrParents = {
    primary: boolean
} | {
    parents: [
        TAspect,
        TAspect
    ]
}

type TAspectData = Pick<TPrimaryOrParents, keyof TPrimaryOrParents> & {
    name: TAspect,
}
type TAspectFullData = TAspectData & {
    connections: TAspect[]
}

class AspectData implements TAspectData {
    readonly name: TAspect;
    readonly primary?: boolean;
    readonly parents?: [TAspect, TAspect];

    constructor(name: TAspect);
    constructor(name: TAspect, parent1: TAspect, parent2: TAspect);

    constructor(name: TAspect, parent1?: TAspect, parent2?: TAspect) {
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
    return aspectDataArray.reduce<Record<TAspect, TAspectFullData>>((acc, aspectData) => {
        const {parents, name} = aspectData;

        parents?.forEach(parentName => {
            if(!acc[parentName]) {
                return
            }
            acc[parentName].connections.push(name)
        })

        return {
            ...acc,
            [name]: {
                ...aspectData,
                connections: parents?.length ? [...parents] : []
            }
        }
    }, {} as Record<TAspect, TAspectFullData>)
}


const aspects = createDataList([
    new AspectData(EAspect.ordo),
    new AspectData(EAspect.ignis),
    new AspectData(EAspect.aer),
    new AspectData(EAspect.perditio),
    new AspectData(EAspect.terra),
    new AspectData(EAspect.aqua),

    new AspectData(EAspect.gelum, EAspect.ignis, EAspect.perditio),
    new AspectData(EAspect.lux, EAspect.aer, EAspect.ignis),
    new AspectData(EAspect.motus, EAspect.aer, EAspect.ordo),
    new AspectData(EAspect.permutatio, EAspect.ordo, EAspect.perditio),
    new AspectData(EAspect.potentia, EAspect.ignis, EAspect.ordo),
    new AspectData(EAspect.tempestas, EAspect.aer, EAspect.aqua),
    new AspectData(EAspect.vacuos, EAspect.aer, EAspect.perditio),
    new AspectData(EAspect.venenum, EAspect.aqua, EAspect.perditio),
    new AspectData(EAspect.victus, EAspect.aqua, EAspect.terra),
    new AspectData(EAspect.vitreus, EAspect.ordo, EAspect.terra),

    new AspectData(EAspect.bestia, EAspect.motus, EAspect.victus),
    new AspectData(EAspect.fames, EAspect.vacuos, EAspect.victus),
    new AspectData(EAspect.herba, EAspect.terra, EAspect.victus),
    new AspectData(EAspect.iter, EAspect.motus, EAspect.terra),
    new AspectData(EAspect.limus, EAspect.aqua, EAspect.victus),
    new AspectData(EAspect.metallum, EAspect.terra, EAspect.vitreus),
    new AspectData(EAspect.mortuus, EAspect.perditio, EAspect.victus),
    new AspectData(EAspect.praecantatio, EAspect.potentia, EAspect.vacuos),
    new AspectData(EAspect.sano, EAspect.ordo, EAspect.victus),
    new AspectData(EAspect.tenebrae, EAspect.lux, EAspect.vacuos),
    new AspectData(EAspect.vinculum, EAspect.motus, EAspect.perditio),
    new AspectData(EAspect.volatus, EAspect.aer, EAspect.motus),
    new AspectData(EAspect.radio, EAspect.potentia, EAspect.lux),
    new AspectData(EAspect.tempus, EAspect.vacuos, EAspect.ordo),
    new AspectData(EAspect.primordium, EAspect.vacuos, EAspect.motus),


    new AspectData(EAspect.alienis, EAspect.tenebrae, EAspect.vacuos),
    new AspectData(EAspect.arbor, EAspect.aer, EAspect.herba),
    new AspectData(EAspect.auram, EAspect.aer, EAspect.praecantatio),
    new AspectData(EAspect.corpus, EAspect.bestia, EAspect.mortuus),
    new AspectData(EAspect.exanimis, EAspect.mortuus, EAspect.motus),
    new AspectData(EAspect.spiritus, EAspect.mortuus, EAspect.victus),
    new AspectData(EAspect.vitium, EAspect.perditio, EAspect.praecantatio),
    new AspectData(EAspect.gula, EAspect.fames, EAspect.vacuos),
    new AspectData(EAspect.infernus, EAspect.ignis, EAspect.praecantatio),
    new AspectData(EAspect.superbia, EAspect.vacuos, EAspect.volatus),
    new AspectData(EAspect.magneto, EAspect.metallum, EAspect.iter),
    new AspectData(EAspect.caelum, EAspect.vitreus, EAspect.metallum),
    new AspectData(EAspect.astrum, EAspect.lux, EAspect.primordium),

    new AspectData(EAspect.cognitio, EAspect.ignis, EAspect.spiritus),
    new AspectData(EAspect.sensus, EAspect.aer, EAspect.spiritus),
    new AspectData(EAspect.desidia, EAspect.spiritus, EAspect.vinculum),
    new AspectData(EAspect.luxuria, EAspect.corpus, EAspect.fames),

    new AspectData(EAspect.humanus, EAspect.bestia, EAspect.cognitio),
    new AspectData(EAspect.invidia, EAspect.fames, EAspect.sensus),
    new AspectData(EAspect.strontio, EAspect.cognitio, EAspect.perditio),
    new AspectData(EAspect.aequalitas, EAspect.cognitio, EAspect.ordo),
    new AspectData(EAspect.vesania, EAspect.cognitio, EAspect.vitium),

    new AspectData(EAspect.instrumentum, EAspect.humanus, EAspect.ordo),
    new AspectData(EAspect.lucrum, EAspect.fames, EAspect.humanus),
    new AspectData(EAspect.messis, EAspect.herba, EAspect.humanus),
    new AspectData(EAspect.perfodio, EAspect.humanus, EAspect.terra),
    new AspectData(EAspect.gloria, EAspect.humanus, EAspect.iter),

    new AspectData(EAspect.fabrico, EAspect.humanus, EAspect.instrumentum),
    new AspectData(EAspect.machina, EAspect.instrumentum, EAspect.motus),
    new AspectData(EAspect.meto, EAspect.instrumentum, EAspect.messis),
    new AspectData(EAspect.pannus, EAspect.bestia, EAspect.instrumentum),
    new AspectData(EAspect.telum, EAspect.instrumentum, EAspect.ignis),
    new AspectData(EAspect.tutamen, EAspect.instrumentum, EAspect.terra),
    new AspectData(EAspect.terminus, EAspect.lucrum, EAspect.alienis),
    new AspectData(EAspect.nebrisum, EAspect.lucrum, EAspect.perfodio),

    new AspectData(EAspect.ira, EAspect.ignis, EAspect.telum),
    new AspectData(EAspect.electrum, EAspect.potentia, EAspect.machina),
    new AspectData(EAspect.tabernus, EAspect.tutamen, EAspect.iter),
])

export default aspects;
