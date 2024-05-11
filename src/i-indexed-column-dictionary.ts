import { IIndexableValue } from "./i-indexable-value";

export interface IIndexedColumnDictionary {

    upsert(values: IIndexableValue<unknown>[], key?: number): Promise<void>;
    get(key: number): Promise<IIndexableValue<unknown>[] | undefined>;
    getByIndexedColumn(indexCol: number, indexValue: string, resolver: (keys: Set<number>) => Promise<Set<number> | IIndexableValue<unknown>[]>): Promise<IIndexableValue<unknown>[] | Set<number> | undefined>;
    getAll(indicativeSize: number): Promise<AsyncGenerator<[number, IIndexableValue<unknown>[]]>>;
}
