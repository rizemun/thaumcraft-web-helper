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
    'radio',
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
    // forth addition
    'cognitio',
    'sensus',
    'desidia',
    'luxuria',
    //fifth addition
    'humanus',
    'invidia',
    'strontio',
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
    'tutamen',
    'terminus',
    'nebrisum',
    //eight addition
    'ira',
    'electrum',
] as const;

export type TAspectName = typeof aspectList[number];

type TAspectCollection = {
    [P in TAspectName]: P;
}

export const ASPECT = aspectList.reduce((acc, aspect) => ({
    ...acc,
    [aspect]: aspect
}), {} as TAspectCollection)
