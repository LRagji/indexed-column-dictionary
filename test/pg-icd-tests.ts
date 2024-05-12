import { PGICD } from "../src/pg-icd";
import { IIndexableValue } from "../src/i-indexable-value";
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { IIndexedColumnDictionary } from "../src/i-indexed-column-dictionary";
import Sinon from "sinon";

describe("IndexedTable", () => {
    //let indexedTable: IIndexedColumnDictionary;
    let queryExecutorStub: Sinon.SinonStub;

    beforeEach(() => {
        Sinon.restore();
        queryExecutorStub = Sinon.stub();
    });

    it("should iniialize with correct queries for a config with alias table", async () => {
        queryExecutorStub.resolves();
        const indexedTable = new PGICD(queryExecutorStub, {
            tableName: "test",
            indexedTable: true,
            columns: [
                { name: "column1", dataType: "text", nullable: false, indexed: true },
                { name: "column2", dataType: "text", nullable: false, indexed: true }
            ]
        });
        await indexedTable.init();

        assert.strictEqual(queryExecutorStub.calledOnce, true);
        assert.strictEqual(queryExecutorStub.firstCall.args.length, 2);
        assert.strictEqual(queryExecutorStub.firstCall.firstArg[0], "CREATE TABLE IF NOT EXISTS $1 ($2 $3 $4, $5 $6 $7, $8 $9 $10);");
        assert.deepEqual(queryExecutorStub.firstCall.lastArg[0], ["test", "row_key", "serial", "not null", "column1", "text", "not null", "column2", "text", "not null"]);
    });
    // it("should insert a row and retrieve it by index", async () => {
    //     const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
    //     const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
    //     await indexedTable.upsert(row1, 1);
    //     await indexedTable.upsert(row2, 2);

    //     const result = await indexedTable.getByIndexedColumn<Set<number>>(0, "key3", (keys: Set<number>) => Promise.resolve(keys));

    //     assert.strictEqual(result?.size, 1);
    //     assert.strictEqual(result?.has(2), true);
    // });

    // it("should return all rows", async () => {
    //     const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
    //     const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
    //     await indexedTable.upsert(row1, 1);
    //     await indexedTable.upsert(row2, 2);

    //     const result = new Map<number, IIndexableValue<string>[]>();
    //     for await (const resultArray of indexedTable.getAll(1)) {
    //         resultArray.forEach(([key, value]) =>
    //             result.set(key, value as IIndexableValue<string>[]));
    //     }
    //     ``
    //     assert.strictEqual(result.size, 2);
    //     assert.strictEqual(result.get(1), row1);
    //     assert.strictEqual(result.get(2), row2);

    // });
});