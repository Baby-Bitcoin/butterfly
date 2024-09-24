# 🦋 butterfly.js

The smallest in-memory database software in the world.

## Features

- Lightweight and fast JSON in-memory database (2.75KB minified).
- Works with JSON out of the box (100% JSON data structure support).
- Persistent storage using NDJSON log files.
- Support for multiple indexes.
- CRUD operations and basic search capabilities.

## Installation

1. Clone the repository or download the files.
2. Install dependencies using npm:

    ```bash
    npm install
    ```

3. Run the demo application:

    ```bash
    node app.js
    ```

## Usage

### 1. Import and Initialize the Database

```js
const { InMemoryDB, dbConnection } = require('./butterfly.js'); // Adjust path if necessary

(async () => {
    const db = dbConnection;
    // Your database operations go here
})();
```

### 2. Setting and Getting Keys
```js
(async () => {
    // Setting a key-value pair in the ADDRESSES_DB
    await db.setKey(InMemoryDB.ADDRESSES_DB, '12345', { street: 'Main St', city: 'Metropolis' });

    // Retrieving the value associated with a key
    const address = await db.getKey(InMemoryDB.ADDRESSES_DB, '12345');
    console.log('Address:', address); // Output: { street: 'Main St', city: 'Metropolis' }
})();
```

### 3. Deleting a Key
```js
(async () => {
    // Setting a key-value pair
    await db.setKey(InMemoryDB.ADDRESSES_DB, '12345', { street: 'Main St', city: 'Metropolis' });

    // Deleting the key
    await db.deleteKey(InMemoryDB.ADDRESSES_DB, '12345');

    // Trying to get the deleted key
    const address = await db.getKey(InMemoryDB.ADDRESSES_DB, '12345');
    console.log('Deleted Address:', address); // Output: null
})();
```

### 4. Retrieving All Keys in an Index
```js
(async () => {
    // Setting multiple keys
    await db.setKey(InMemoryDB.ADDRESSES_DB, '12345', { street: 'Main St', city: 'Metropolis' });
    await db.setKey(InMemoryDB.ADDRESSES_DB, '67890', { street: 'Elm St', city: 'Gotham' });

    // Retrieving all keys in the ADDRESSES_DB index
    const allKeys = await db.getAllKeys(InMemoryDB.ADDRESSES_DB);
    console.log('All Address Keys:', allKeys); // Output: ['12345', '67890']
})();
```

### 5. Paginated Key Retrieval
```js
(async () => {
    // Setting multiple keys
    await db.setKey(InMemoryDB.ADDRESSES_DB, '12345', { street: 'Main St', city: 'Metropolis' });
    await db.setKey(InMemoryDB.ADDRESSES_DB, '67890', { street: 'Elm St', city: 'Gotham' });
    await db.setKey(InMemoryDB.ADDRESSES_DB, '11223', { street: '5th Ave', city: 'Star City' });

    // Retrieving 2 keys, starting from page 1 (which is the second set of results)
    const paginatedKeys = await db.getNKeys(InMemoryDB.ADDRESSES_DB, 2, 1);
    console.log('Paginated Keys:', paginatedKeys); // Output: ['11223']
})();
```

### 6. Searching Keys with a Regex Pattern
```js
(async () => {
    // Setting multiple keys
    await db.setKey(InMemoryDB.ADDRESSES_DB, '12345', { street: 'Main St', city: 'Metropolis' });
    await db.setKey(InMemoryDB.ADDRESSES_DB, '67890', { street: 'Elm St', city: 'Gotham' });
    await db.setKey(InMemoryDB.ADDRESSES_DB, '11223', { street: '5th Ave', city: 'Star City' });

    // Searching keys that start with '1'
    const searchResults = await db.searchKeys(InMemoryDB.ADDRESSES_DB, '^1');
    console.log('Search Results:', searchResults); // Output: ['12345', '11223']
})();
```

### 7. Handling Complex Data Types
```js
(async () => {
    // Setting an array as a value
    await db.setKey(InMemoryDB.COMMENTS_DB, 'comment1', ['Nice post!', 'Great work!']);

    // Updating the array by merging with a new one
    await db.setKey(InMemoryDB.COMMENTS_DB, 'comment1', ['Awesome!', 'Good read.']);

    // Retrieving the merged array
    const comments = await db.getKey(InMemoryDB.COMMENTS_DB, 'comment1');
    console.log('Comments:', comments); // Output: ['Nice post!', 'Great work!', 'Awesome!', 'Good read.']
})();
```

### 8. Getting a New Unique ID
```js
(async () => {
    // Setting posts with specific IDs
    await db.setKey(InMemoryDB.POSTS_DB, '1', { id: 1, title: 'First Post' });
    await db.setKey(InMemoryDB.POSTS_DB, '2', { id: 2, title: 'Second Post' });

    // Getting a new unique ID for a post
    const newID = await db.getNewID();
    console.log('New Post ID:', newID); // Output: 3
})();
```

### 9. Log Reconstruction and Data Compaction
```js
(async () => {
    // Reconstruct database state from logs at startup
    await db.reconstructFromLogs();

    // Check the current state of the index
    const indexContent = await db.getIndexContent(InMemoryDB.ADDRESSES_DB);
    console.log('Index Content:', indexContent);
})();
```
