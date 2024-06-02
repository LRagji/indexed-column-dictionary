import { IIndexableValue } from "./i-indexable-value";

/**
 * Represents an indexed column dictionary.
 */
export interface IIndexedColumnDictionary {

    /**
     * Upserts the given values into the dictionary.
     * @param values - The values to upsert.
     * @param key - The optional key to associate with the values.
     */
    upsert(values: IIndexableValue<unknown>[], key?: number): Promise<void>;

    /**
     * Retrieves the values associated with the given key.
     * @param key - The key to retrieve values for.
     * @returns A promise that resolves to an array of values, or undefined if the key is not found.
     */
    get(key: number): Promise<IIndexableValue<unknown>[] | undefined>;

    /**
     * Retrieves the values associated with the given indexed column and index value,
     * and applies a mapper function to the resulting keys.
     * @param indexColNumber - The number of the indexed column.
     * @param indexValue - The value of the index.
     * @param mapper - The mapper function to apply to the resulting keys.
     * @returns A promise that resolves to the result of the mapper function, or undefined if no keys are found.
     */
    getByIndexedColumn<MapperReturnType>(indexColNumber: number, indexValue: string, mapper: (keys: Set<number>) => Promise<MapperReturnType>): Promise<MapperReturnType | undefined>;

    /**
     * Retrieves the values associated with the given indexed column, sorted by the index value,
     * @param indexCol The number of the indexed column.
     * @param sortFunction The function to sort the indexed values.
     * @param mapper The mapper function to apply to the resulting indexed values.
     */
    getBySortedIndexedColumn<T>(indexCol: number, sortFunction: (a: string, b: string) => number, mapper: (keys: Set<number>) => Promise<T>): AsyncGenerator<T, void, void>;

    /**
     * Retrieves all key-value pairs in the dictionary.
     * @param indicativeSize - An indicative size to control the number of key-value pairs returned.
     * @returns An async generator that yields key-value pairs.
     */
    getAll(indicativeSize: number): AsyncGenerator<[number, IIndexableValue<unknown>[]][]>;
}
