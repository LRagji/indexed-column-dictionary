# indexed-column-dictionary

This package represent a table data structure with indexing and sorting on columns.

1. Allows adding multiple columns.
2. Columns values can be different from their indexed values.
3. Allows sorting
4. Provides Mapper and Generator Interface for pagination.
5. Currently provides in memory implementation, in future release for pg implementation

## Getting Started

```javascript
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
```

## Built with

1. Authors :heart: for Open Source.

## Contributions

1. New ideas/techniques are welcomed.
2. Raise a Pull Request.

## License

This project is contribution to public domain and completely free for use, view [LICENSE.md](/license.md) file for details.
