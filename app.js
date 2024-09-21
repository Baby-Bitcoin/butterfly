const { InMemoryDB, dbConnection } = require('./butterfly.js'); // Adjust path if necessary

(async () => {
    const db = dbConnection;

    // 1. Adding Data
    console.log("Adding data...");
    await db.setKey(InMemoryDB.POSTS_DB, 1, { id: 1, title: "Hello World", content: "This is the first post." });
    await db.setKey(InMemoryDB.POSTS_DB, 2, { id: 2, title: "Another Post", content: "This is another post." });

    // 2. Retrieving Data
    console.log("Retrieving data...");
    const post1 = await db.getKey(InMemoryDB.POSTS_DB, 1);
    console.log("Post 1:", post1);

    const post2 = await db.getKey(InMemoryDB.POSTS_DB, 2);
    console.log("Post 2:", post2);

    // 3. Getting All Keys
    console.log("Getting all keys...");
    const allKeys = await db.getAllKeys(InMemoryDB.POSTS_DB);
    console.log("All Keys:", allKeys);

    // 4. Search for Keys
    console.log("Searching for keys with pattern '1'...");
    const searchResults = await db.searchKeys(InMemoryDB.POSTS_DB, "1");
    console.log("Search Results:", searchResults);

    // 5. Deleting a Key
    console.log("Deleting key 1...");
    await db.deleteKey(InMemoryDB.POSTS_DB, 1);

    // Verify Deletion
    const deletedPost = await db.getKey(InMemoryDB.POSTS_DB, 1);
    console.log("Deleted Post:", deletedPost); // Should be null

    // 6. Generating a New ID for a Post
    console.log("Getting a new ID for a post...");
    const newId = await db.getNewID();
    console.log("New ID:", newId);
})();
