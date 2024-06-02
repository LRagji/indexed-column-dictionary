// import { PGICD } from "../src/pg-icd";
// import { IIndexableValue } from "../src/i-indexable-value";
// import { after, before, beforeEach, describe, it } from "node:test";
// import assert from "node:assert";
// import { IIndexedColumnDictionary } from "../src/i-indexed-column-dictionary";
// import pgpNS from "pg-promise";

// describe("IndexedTable", () => {
//     //let indexedTable: IIndexedColumnDictionary;
//     let queryExecutor: (parameterizedSQLQueries: string[], values: (string | number)[][]) => Promise<void>;
//     const db = pgpNS();
//     let pgpConnection: pgpNS.IDatabase<any>;

//     before(async () => {
//         const cn = 'postgres://postgres:postgres@localhost:5432/clone';
//         pgpConnection = db(cn);
//         queryExecutor = async (queries: string[], values: (string | number)[][]) => {
//             return pgpConnection.tx(async (t) => {
//                 let idx = 0;
//                 for (const query of queries) {
//                     await t.query(query, values[idx]);
//                     idx++;
//                 }
//             });
//         }
//     });

//     after(async () => {
//         db.end();
//     });

//     it("should iniialize with correct queries for a config with alias table", async () => {
//         try {
//             const indexedTable = new PGICD(queryExecutor, {
//                 tableName: "test",
//                 indexedTable: true,
//                 columns: [
//                     { name: "column1", dataType: "text", nullable: false, indexed: true },
//                     { name: "column2", dataType: "text", nullable: false, indexed: true }
//                 ]
//             });

//             await indexedTable.init();
//         }
//         catch (error) {
//             console.error(error);
//             assert.fail((error as Error).message);
//         }
//     });
//     // it("should insert a row and retrieve it by index", async () => {
//     //     const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
//     //     const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
//     //     await indexedTable.upsert(row1, 1);
//     //     await indexedTable.upsert(row2, 2);

//     //     const result = await indexedTable.getByIndexedColumn<Set<number>>(0, "key3", (keys: Set<number>) => Promise.resolve(keys));

//     //     assert.strictEqual(result?.size, 1);
//     //     assert.strictEqual(result?.has(2), true);
//     // });

//     // it("should return all rows", async () => {
//     //     const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
//     //     const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
//     //     await indexedTable.upsert(row1, 1);
//     //     await indexedTable.upsert(row2, 2);

//     //     const result = new Map<number, IIndexableValue<string>[]>();
//     //     for await (const resultArray of indexedTable.getAll(1)) {
//     //         resultArray.forEach(([key, value]) =>
//     //             result.set(key, value as IIndexableValue<string>[]));
//     //     }
//     //     ``
//     //     assert.strictEqual(result.size, 2);
//     //     assert.strictEqual(result.get(1), row1);
//     //     assert.strictEqual(result.get(2), row2);

//     // });
// });