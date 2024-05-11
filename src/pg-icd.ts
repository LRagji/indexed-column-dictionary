import { IIndexableValue } from "./i-indexable-value";
import { IIndexedColumnDictionary } from "./i-indexed-column-dictionary";

export class PGICD implements IIndexedColumnDictionary {

    // private rowCounter = 0;
    // private readonly table = new Map<number, IIndexableValue<unknown>[]>();
    // private readonly indexes = new Map<number, Map<string, Set<number>>>();

    constructor(
        private readonly queryExecutor: <returnType>(parameterizedSQLQuery: string, values: string | number[]) => returnType,
        private readonly config: {
            tableName: string,
            columns: {
                name: string,
                dataType: string,
                indexed: boolean
            }[]
        }) {

        const createTableSQLValues = [this.config.tableName];
        const tableColumns = this.config.columns.reduce((acc, column) => {
            acc += `$${createTableSQLValues.length} $${createTableSQLValues.length + 1},`;
            createTableSQLValues.push(column.name);
            createTableSQLValues.push(column.dataType);
            return acc;
        }, "");
        const createTableSQL = `CREATE TABLE IF NOT EXISTS $1 (${tableColumns});`;

        const createIndexedTableSQLValues = [this.config.tableName + "_indexed"];
        const indexedTableColumns = this.config.columns.reduce((acc, column) => {
            if (column.indexed === false) return acc;
            acc += `$${createIndexedTableSQLValues.length} $${createTableSQLValues.length + 1},`;
            createTableSQLValues.push(column.name);
            createTableSQLValues.push(column.dataType);
            return acc;
        }, "");
        const createIndexedTableSQL = `CREATE TABLE IF NOT EXISTS $1 (${indexedTableColumns});`;


    }

    public async upsert(row: IIndexableValue<unknown>[], rowId?: number) {
        // if (rowId === undefined) {
        //     rowId = this.rowCounter++;
        // }
        // this.table.set(rowId, row);

        // for (const indexCol of this.columnsToIndex) {
        //     if (row[indexCol] != undefined) {
        //         const indexMap = this.indexes.get(indexCol) || new Map<string, Set<number>>();
        //         const rowMap = indexMap.get(row[indexCol].IndexValue) || new Set<number>();
        //         rowMap.add(rowId);
        //         indexMap.set(row[indexCol].IndexValue, rowMap);
        //         this.indexes.set(indexCol, indexMap);
        //     }
        // }
    }

    public async get(rowId: number): Promise<IIndexableValue<unknown>[] | undefined> {
        // return this.table.get(rowId);
    }

    public async getByIndexedColumn<T>(indexCol: number, indexKey: string, mapper: (keys: Set<number>) => Promise<T>): Promise<T | undefined> {
        // const keys = this.indexes.get(indexCol)?.get(indexKey);
        // if (keys === undefined) {
        //     return undefined;
        // }
        // return mapper(keys);
    }

    public async *getAll(indicativeSize: number = 1): AsyncGenerator<[number, IIndexableValue<unknown>[]][], void, void> {
        // let returnArray = new Array<[number, IIndexableValue<unknown>[]]>();
        // for (const [key, values] of this.table) {
        //     returnArray.push([key, values]);
        //     if (returnArray.length === indicativeSize) {
        //         yield Promise.resolve(returnArray);
        //         returnArray = [];
        //     }
        // }
        // if (returnArray.length > 0) {
        //     yield Promise.resolve(returnArray);
        //     returnArray = [];
        // }
    }
}