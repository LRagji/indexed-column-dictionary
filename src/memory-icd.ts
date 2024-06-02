import { IIndexableValue } from "./i-indexable-value";
import { IIndexedColumnDictionary } from "./i-indexed-column-dictionary";

export class MemoryICD implements IIndexedColumnDictionary {

    private rowCounter = 0;
    private readonly table = new Map<number, IIndexableValue<unknown>[]>();
    private readonly indexes = new Map<number, Map<string, Set<number>>>();

    constructor(private readonly columnsToIndex: number[]) { }

    public async upsert(row: IIndexableValue<unknown>[], rowId?: number) {
        if (rowId === undefined) {
            rowId = this.rowCounter++;
        }
        this.table.set(rowId, row);

        for (const indexCol of this.columnsToIndex) {
            if (row[indexCol] != undefined) {
                const indexMap = this.indexes.get(indexCol) || new Map<string, Set<number>>();
                const rowMap = indexMap.get(row[indexCol].IndexValue) || new Set<number>();
                rowMap.add(rowId);
                indexMap.set(row[indexCol].IndexValue, rowMap);
                this.indexes.set(indexCol, indexMap);
            }
        }
    }

    public async get(rowId: number): Promise<IIndexableValue<unknown>[] | undefined> {
        return this.table.get(rowId);
    }

    public async getByIndexedColumn<T>(indexCol: number, indexKey: string, mapper: (keys: Set<number>) => Promise<T>): Promise<T | undefined> {
        const keys = this.indexes.get(indexCol)?.get(indexKey);
        if (keys === undefined) {
            return undefined;
        }
        return mapper(keys);
    }

    public async *getBySortedIndexedColumn<T>(indexCol: number, sortFunction: (a: string, b: string) => number, mapper: (keys: Set<number>) => Promise<T>): AsyncGenerator<T, void, void> {
        const keys = this.indexes.get(indexCol);
        if (keys === undefined) {
            return;
        }
        const sortedKeys = Array.from(keys.keys()).sort(sortFunction);
        for (const key of sortedKeys) {
            const rowIds = keys.get(key);
            if (rowIds !== undefined) {
                yield mapper(rowIds);
            }
        }
    }


    public async *getAll(indicativeSize: number = 1): AsyncGenerator<[number, IIndexableValue<unknown>[]][], void, void> {
        let returnArray = new Array<[number, IIndexableValue<unknown>[]]>();
        for (const [key, values] of this.table) {
            returnArray.push([key, values]);
            if (returnArray.length === indicativeSize) {
                yield Promise.resolve(returnArray);
                returnArray = [];
            }
        }
        if (returnArray.length > 0) {
            yield Promise.resolve(returnArray);
            returnArray = [];
        }
    }
}