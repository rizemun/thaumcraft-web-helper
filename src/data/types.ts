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
] as const;

export type TAspectName = typeof aspectList[number];

type TAspectCollection = {
    [P in TAspectName]: P;
}

export const ASPECT = aspectList.reduce((acc, aspect) => ({
    ...acc,
    [aspect]: aspect
}), {} as TAspectCollection)
