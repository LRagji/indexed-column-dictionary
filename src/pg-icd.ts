import { IIndexableValue } from "./i-indexable-value";
import { IIndexedColumnDictionary } from "./i-indexed-column-dictionary";

export class PGICD implements IIndexedColumnDictionary {

    // private rowCounter = 0;
    // private readonly table = new Map<number, IIndexableValue<unknown>[]>();
    // private readonly indexes = new Map<number, Map<string, Set<number>>>();

    constructor(
        private readonly queryExecutor: <returnType>(parameterizedSQLQueries: string[], values: (string | number)[][]) => returnType,
        private readonly config: {
            tableName: string,
            indexedTable: boolean,
            columns: {
                name: string,
                dataType: string,
                nullable: boolean,
                indexed: boolean
            }[]
        }) { }

    public async init() {
        const queries: string[] = [];
        const values = [] as (string | number)[][];
        const rowKeyColumnName = "row_key";
        const rowKeyColumnDataType = "serial";
        const indexedTableSuffix = "_indexed";
        const notnull = "not null";

        //create main table
        const createTableSQLValues = [this.config.tableName, rowKeyColumnName, rowKeyColumnDataType, notnull];
        const tableColumns = this.config.columns.reduce((acc, column) => {
            if (column.name === rowKeyColumnName) throw new Error(`Column name cannot be '${rowKeyColumnName}' as it is reserved for system use.`);
            createTableSQLValues.push(column.name);
            acc += `$${createTableSQLValues.length} `;
            createTableSQLValues.push(column.dataType);
            acc += `$${createTableSQLValues.length} `;
            if (column.nullable === false) {
                createTableSQLValues.push(notnull);
                acc += `$${createTableSQLValues.length} `;
            }
            acc = acc.trimEnd();
            acc += ", ";
            return acc;
        }, "$2 $3 $4, ");
        const createTableSQL = `CREATE TABLE IF NOT EXISTS $1 (${tableColumns.substring(0, tableColumns.length - 2)});`;
        queries.push(createTableSQL);
        values.push(createTableSQLValues);

        //create indexed table
        if (this.config.indexedTable === true) {
            const createIndexedTableSQLValues = [this.config.tableName + `indexedTableSuffix`, rowKeyColumnName, "integer", notnull, this.config.tableName, rowKeyColumnName];
            const indexedTableColumns = this.config.columns.reduce((acc, column) => {
                if (column.indexed === false) return acc;
                createIndexedTableSQLValues.push(column.name);
                acc += `$${createIndexedTableSQLValues.length}`;
                createIndexedTableSQLValues.push(column.dataType);
                acc += `$${createIndexedTableSQLValues.length}`;
                if (column.nullable === false) {
                    createIndexedTableSQLValues.push(notnull);
                    acc += `$${createIndexedTableSQLValues.length}`;
                }
                acc += ",";
                return acc;
            }, "$2 $3 $4 REFERENCES $5 ($6),");
            const createIndexedTableSQL = `CREATE TABLE IF NOT EXISTS $1 (${indexedTableColumns});`;
            queries.push(createIndexedTableSQL);
            values.push(createIndexedTableSQLValues);
        }
        //create indexes
        const createIndexSQLValues = [this.config.tableName + "_idx"];
        createIndexSQLValues.push(this.config.indexedTable ? (this.config.tableName + indexedTableSuffix) : (this.config.tableName));
        createIndexSQLValues.push(rowKeyColumnName);
        const indexedColumns = this.config.columns.reduce((acc, column) => {
            if (column.indexed === false) return acc;
            acc += `$${createIndexSQLValues.length},`;
            createIndexSQLValues.push(column.name);
            return acc;
        }, `$${createIndexSQLValues.length},`);
        const createIndexSQL = `CREATE INDEX IF NOT EXISTS $1 ON $2 ( ${indexedColumns});`;
        if (createIndexSQLValues.length > 3) {
            queries.push(createIndexSQL);
            values.push(createIndexSQLValues);
        }

        await this.queryExecutor(queries, values);
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
        return undefined
        // return this.table.get(rowId);
    }

    public async getByIndexedColumn<T>(indexCol: number, indexKey: string, mapper: (keys: Set<number>) => Promise<T>): Promise<T | undefined> {
        return undefined
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