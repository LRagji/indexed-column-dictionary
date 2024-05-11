import { IIndexableValue } from "./i-indexable-value";

export class MemoryICD {

    private rowCounter = 0;
    private readonly table = new Map<number, IIndexableValue<unknown>[]>();
    private readonly indexes = new Map<number, Map<string, Set<number>>>();

    constructor(private readonly columnsToIndex: number[]) { }

    public upsert(row: IIndexableValue<unknown>[], rowId?: number) {
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

    public get(rowId: number): IIndexableValue<unknown>[] | undefined {
        return this.table.get(rowId);
    }

    public getByIndexedColumn(indexCol: number, indexKey: string): Set<number> | undefined {
        return this.indexes.get(indexCol)?.get(indexKey);
    }

    public async *getAll(indicativeSize: number = 1): AsyncGenerator<[number, IIndexableValue<unknown>[]][], void, void> {
        let returnArray = new Array<[number, IIndexableValue<unknown>[]]>(indicativeSize);
        for (const [key, values] of this.table) {
            returnArray.push([key, values]);
            if (returnArray.length === indicativeSize) {
                yield await Promise.resolve(returnArray);
                returnArray = [];
            }
        }
        if (returnArray.length > 0) {
            yield await Promise.resolve(returnArray);
            returnArray = [];
        }
    }
}