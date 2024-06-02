import { MemoryICD } from "../dist/src/index.js";
const columnsToIndex = [0, 1]; // This are index numbers of the columns that will be indexed
const icd = new MemoryICD(columnsToIndex);

const rows = [
    [{ IndexValue: "Johnny", Data: "John" }, { IndexValue: "D", Data: "Doe" }, 30],
    [{ IndexValue: "Jane", Data: "Janet" }, { IndexValue: "D", Data: "Doe" }, 25],
    [{ IndexValue: "R", Data: "Rammy" }, { IndexValue: "R", Data: "Ringer" }, 60],
    [{ IndexValue: "Red", Data: "Raymond" }, { IndexValue: "R", Data: "Reddinton" }, 50],
]

for (const row of rows) {
    await icd.upsert(row); // Upsert the rows into the data store
}

const mapper = async (rowIds) => {
    const results = [];
    for (const rowId of rowIds) {
        results.push(await icd.get(rowId));
    }
    return results;
}

const results = await icd.getByIndexedColumn(0, "Johnny", mapper);// Get all rows with IndexValue of "Johnny"

console.log(results); // Output: [ [ { IndexValue: 'Johnny', Data: 'John' }, { IndexValue: 'D', Data: 'Doe' }, 30 ] ]