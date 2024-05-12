import { IIndexableValue } from "./i-indexable-value";
import { IIndexedColumnDictionary } from "./i-indexed-column-dictionary";

export class PGICD implements IIndexedColumnDictionary {

    // private rowCounter = 0;
    // private readonly table = new Map<number, IIndexableValue<unknown>[]>();
    // private readonly indexes = new Map<number, Map<string, Set<number>>>();
    private readonly indexedTableSuffix = "_indexed";

    constructor(
        private readonly queryExecutor: (parameterizedSQLQueries: string[], values: (string | number)[][]) => Promise<unknown>,
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
        const notnull = "NOT NULL";

        //create main table
        const createTableSQLValues = [this.config.tableName, rowKeyColumnName, rowKeyColumnDataType, notnull];
        const tableColumns = this.config.columns.reduce((acc, column) => {
            if (column.name === rowKeyColumnName) throw new Error(`Column name cannot be '${rowKeyColumnName}' as it is reserved for system use.`);
            createTableSQLValues.push(column.name);
            acc += `$${createTableSQLValues.length}:name `;
            createTableSQLValues.push(column.dataType);
            acc += `$${createTableSQLValues.length}:value `;
            if (column.nullable === false) {
                createTableSQLValues.push(notnull);
                acc += `$${createTableSQLValues.length}:value `;
            }
            acc = acc.trimEnd();
            acc += ", ";
            return acc;
        }, "$2:name $3:value UNIQUE $4:value, ");
        const createTableSQL = `CREATE TABLE IF NOT EXISTS $1:name (${tableColumns.substring(0, tableColumns.length - 2)});`;
        queries.push(createTableSQL);
        values.push(createTableSQLValues);

        //create indexed table
        if (this.config.indexedTable === true) {
            const createIndexedTableSQLValues = [this.config.tableName + this.indexedTableSuffix, rowKeyColumnName, "integer", notnull, this.config.tableName, rowKeyColumnName];
            const indexedTableColumns = this.config.columns.reduce((acc, column) => {
                if (column.indexed === false) return acc;
                createIndexedTableSQLValues.push(column.name);
                acc += `$${createIndexedTableSQLValues.length}:name `;
                createIndexedTableSQLValues.push(column.dataType);
                acc += `$${createIndexedTableSQLValues.length}:value `;
                if (column.nullable === false) {
                    createIndexedTableSQLValues.push(notnull);
                    acc += `$${createIndexedTableSQLValues.length}:value `;
                }
                acc = acc.trimEnd();
                acc += ", ";
                return acc;
            }, "$2:name $3:value $4:value REFERENCES $5:name ($6:name), ");
            const createIndexedTableSQL = `CREATE TABLE IF NOT EXISTS $1:name (${indexedTableColumns.substring(0, indexedTableColumns.length - 2)});`;
            queries.push(createIndexedTableSQL);
            values.push(createIndexedTableSQLValues);
        }
        //create indexes
        const createIndexSQLValues = [this.config.tableName + "_idx"];
        createIndexSQLValues.push(this.config.indexedTable ? (this.config.tableName + this.indexedTableSuffix) : (this.config.tableName));
        createIndexSQLValues.push(rowKeyColumnName);
        const indexedColumns = this.config.columns.reduce((acc, column) => {
            if (column.indexed === false) return acc;
            createIndexSQLValues.push(column.name);
            acc += `$${createIndexSQLValues.length}:name, `;
            return acc;
        }, "");
        const createIndexSQL = `CREATE INDEX IF NOT EXISTS $1:name ON $2:name ($3:name, ${indexedColumns.substring(0, indexedColumns.length - 2)});`;
        if (createIndexSQLValues.length > 3) {
            queries.push(createIndexSQL);
            values.push(createIndexSQLValues);
        }

        await this.queryExecutor(queries, values);
    }

    public async upsert(row: IIndexableValue<unknown>[], rowId?: number) {
        if (this.config.columns.length !== row.length) throw new Error("Row length does not match column length");

        let insertColumns = "";
        let insertValues = "";
        const queryValues = new Array<(string | number)>();
        queryValues.push(this.config.tableName);
        let indexedColumns = "";
        let indexedInsertValues = "";
        const indexedValues = new Array<(string | number)>();
        indexedValues.push(this.config.tableName + this.indexedTableSuffix);
        for (let idx = 0; idx < this.config.columns.length; idx++) {
            const value = row[idx];
            const column = this.config.columns[idx];

            queryValues.push(column.name);
            insertColumns += `$${queryValues.length}:name, `;
            queryValues.push(value.Data as string);
            insertValues += `$${queryValues.length}, `;

            if (this.config.indexedTable === true) {
                if (column.indexed === true) {
                    indexedValues.push(column.name);
                    indexedColumns += `$${indexedValues.length}:name, `;
                    indexedValues.push(value.IndexValue);
                    indexedInsertValues += `$${indexedValues.length}, `;
                }
            }
        }
        if (rowId === undefined) {
            const insertSQL = `INSERT INTO $1:name (${insertColumns.substring(0, insertColumns.length - 2)}) VALUES (${insertValues.substring(0, insertValues.length - 2)});`;
            const insertIndexedSQL = `INSERT INTO $1:name (${indexedColumns.substring(0, indexedColumns.length - 2)}) VALUES (${indexedInsertValues.substring(0, indexedInsertValues.length - 2)});`;
            if (indexedValues.length > 1) {
                await this.queryExecutor([insertSQL, insertIndexedSQL], [queryValues, indexedValues]);
            }
            else {
                await this.queryExecutor([insertSQL], [queryValues]);
            }

        } else {
            //const insertIndexedSQL = `INSERT INTO $1:name ($2:name) VALUES ($3:csv) ON CONFLICT ($2:name) DO UPDATE SET $2:name = $3;`;
        }
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