# 🦋 butterfly.js

The smallest in-memory Node.js database software in the world.

## Features

- Lightweight and fast in-memory database.
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
