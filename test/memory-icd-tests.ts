import { MemoryICD } from "../src/memory-icd";
import { IIndexableValue } from "../src/i-indexable-value";
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";

describe("IndexedTable", () => {
    let indexedTable: MemoryICD;

    beforeEach(() => {
        indexedTable = new MemoryICD([0, 1]);
    });

    it("should insert a row and retrieve it by rowId", () => {
        const row: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
        indexedTable.upsert(row, 1);

        const result = indexedTable.get(1);

        assert.strictEqual(result, row);
    });

    it("should insert a row and retrieve it by index", () => {
        const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
        const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
        indexedTable.upsert(row1, 1);
        indexedTable.upsert(row2, 2);

        const result = indexedTable.getByIndexedColumn(0, "key3");

        assert.strictEqual(result?.size, 1);
        assert.strictEqual(result?.has(2), true);
    });

    it("should return all rows", async () => {
        const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
        const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
        indexedTable.upsert(row1, 1);
        indexedTable.upsert(row2, 2);

        const result = new Map<number, IIndexableValue<string>[]>();
        for await (const resultArray of indexedTable.getAll(10)) {
            resultArray.forEach(([key, value]) =>
                result.set(key, value as IIndexableValue<string>[]));
        }
        ``
        assert.strictEqual(result.size, 2);
        assert.strictEqual(result.get(1), row1);
        assert.strictEqual(result.get(2), row2);

    });
});