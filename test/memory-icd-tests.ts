import { MemoryICD } from "../src/memory-icd";
import { IIndexableValue } from "../src/i-indexable-value";
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";
import { IIndexedColumnDictionary } from "../src/i-indexed-column-dictionary";

describe("IndexedTable", () => {
    let indexedTable: IIndexedColumnDictionary;

    beforeEach(() => {
        indexedTable = new MemoryICD([0, 1]);
    });

    it("should insert a row and retrieve it by rowId", async () => {
        const row: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
        await indexedTable.upsert(row, 1);

        const result = await indexedTable.get(1);

        assert.strictEqual(result, row);
    });

    it("should insert a row and retrieve it by index", async () => {
        const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
        const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
        await indexedTable.upsert(row1, 1);
        await indexedTable.upsert(row2, 2);

        const result = await indexedTable.getByIndexedColumn<Set<number>>(0, "key3", (keys: Set<number>) => Promise.resolve(keys));

        assert.strictEqual(result?.size, 1);
        assert.strictEqual(result?.has(2), true);
    });

    it("should return all rows", async () => {
        const row1: IIndexableValue<string>[] = [{ IndexValue: "key1", Data: "D1" }, { IndexValue: "key2", Data: "D2" }];
        const row2: IIndexableValue<string>[] = [{ IndexValue: "key3", Data: "D3" }, { IndexValue: "key4", Data: "D4" }];
        await indexedTable.upsert(row1, 1);
        await indexedTable.upsert(row2, 2);

        const result = new Map<number, IIndexableValue<string>[]>();
        for await (const resultArray of indexedTable.getAll(1)) {
            resultArray.forEach(([key, value]) =>
                result.set(key, value as IIndexableValue<string>[]));
        }
        ``
        assert.strictEqual(result.size, 2);
        assert.strictEqual(result.get(1), row1);
        assert.strictEqual(result.get(2), row2);

    });

    it("should sort rows for a given index", async () => {
        const row1: IIndexableValue<string>[] = [{ IndexValue: "1000", Data: "D1" }, { IndexValue: "2", Data: "D2" }];
        const row2: IIndexableValue<string>[] = [{ IndexValue: "1", Data: "D3" }, { IndexValue: "3", Data: "D4" }];
        await indexedTable.upsert(row1, 1);
        await indexedTable.upsert(row2, 2);

        const result = new Array<Set<number>>();
        for await (const resultArray of indexedTable.getBySortedIndexedColumn<Set<number>>(0, (a, b) => parseInt(a) - parseInt(b), (keys: Set<number>) => Promise.resolve(keys))) {
            result.push(resultArray);
        }

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].size, 1);
        assert.strictEqual(result[1].size, 1);
        assert.strictEqual(result[0].has(2), true);
        assert.strictEqual(result[1].has(1), true);
    });
});