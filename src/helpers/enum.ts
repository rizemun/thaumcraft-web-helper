type TEnum<T extends readonly string[]> = {
    [P in T[number]]: P;
};

/**
 * Creates Object-like enumeration from list of string values
 * @param list array with enumeration variants
 */
export const getEnum = <T extends readonly string[]>(list: T): TEnum<T> =>
    list.reduce(
        (acc, str: T[number]) => ({
            ...acc,
            [str]: str,
        }),
        {} as TEnum<T>
    );

export type TEnumValueFromList<T extends readonly string[]> = T[number];

export type TEnumValue<T extends TEnum<string[]>> = keyof T;

/**
 * Type safe version of Array.prototype.includes function for working with enumerations
 * @param list array with enumeration variants
 * @param value enumeration variant
 */
export const includes = <T>(list: T[], value: T) => list.includes(value);
