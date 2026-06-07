import {getEnum, TEnumValue} from "../helpers/enum";

const aspectVariants = [
    //nothing
    'none',
    // primary
    'ignis',
    'ordo',
    'aer',
    'aqua',
    'perditio',
    'terra',
    // first addition
    'gelum',
    'lux',
    'motus',
    'permutatio',
    'potentia',
    'tempestas',
    'vacuos',
    'venenum',
    'victus',
    'vitreus',
    // second addition
    'bestia',
    'fames',
    'herba',
    'iter',
    'limus',
    'metallum',
    'mortuus',
    'praecantatio',
    'sano',
    'tenebrae',
    'vinculum',
    'volatus',
    'radio',
    'tempus',
    'primordium',
    // third addition
    'alienis',
    'arbor',
    'auram',
    'corpus',
    'exanimis',
    'spiritus',
    'vitium',
    'gula',
    'infernus',
    'superbia',
    'magneto',
    'caelum',
    'astrum',
    // forth addition
    'cognitio',
    'sensus',
    'desidia',
    'luxuria',
    //fifth addition
    'humanus',
    'invidia',
    'strontio',
    'aequalitas',
    'vesania',
    //sixth addition
    'instrumentum',
    'lucrum',
    'messis',
    'perfodio',
    'gloria',
    //seventh addition
    'fabrico',
    'machina',
    'meto',
    'pannus',
    'telum',
    'tutamen',
    'terminus',
    'nebrisum',
    //eight addition
    'ira',
    'electrum',
    'tabernus'
] as const;

export const EAspect = getEnum(aspectVariants)
export type TAspect = typeof aspectVariants[number]