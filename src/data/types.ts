const aspectList = [
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
    // third addition
    'alienis',
    'arbor',
    'auram',
    'corpus',
    'exanimis',
    'spiritus',
    'vitium',
    // forth addition
    'cognitio',
    'sensus',
    //fifth addition
    'humanus',
    //sixth addition
    'instrumentum',
    'lucrum',
    'messis',
    'perfodio',
    //seventh addition
    'fabrico',
    'machina',
    'meto',
    'pannus',
    'telum',
    'tutamen'
] as const;

export type TAspectName = typeof aspectList[number];

type TAspectCollection = {
    [P in TAspectName]: P;
}

export const ASPECT = aspectList.reduce((acc, aspect) => ({
    ...acc,
    [aspect]: aspect
}), {} as TAspectCollection)
