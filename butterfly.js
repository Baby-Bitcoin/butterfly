const fs = require('fs');
const path = require('path');
const readline = require('readline');

class butterfly {

    static INDEX_0 = 0;
    static INDEX_1 = 1;
    static INDEX_2 = 2;
    static INDEX_3 = 3;
    // add more indexes if you want, and rename them to suit the purpose you are using it for. For example if you want to store basic user info, name it something like USER_DB = 0, etc.

    constructor() {
        if (butterfly.instance) {
            return butterfly.instance;
        }

        this.indexes = new Array(16).fill(null).map(() => ({})); // 16 indexes
        this.logDir = path.join(__dirname, 'db/'); // Log directory path

        // Ensure db folder exists
        this.ensureLogDirExists();

        // Initialize the DB and reconstruct from logs at startup
        this.reconstructFromLogs();

        butterfly.instance = this;  // Save the instance
    }

    /**
     * Ensures the db directory exists. If it doesn't, creates it.
     */
    ensureLogDirExists() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir);
            console.log(`Created directory: ${this.logDir}`);
        }
    }

    /**
     * Reconstructs the in-memory database from log files during application startup using streams.
     * Implements key eviction to keep only the latest state of each key, and rewrites the log file to keep it small.
     */
    async reconstructFromLogs() {
        for (let i = 0; i < 16; i++) {
            const filePath = path.join(this.logDir, `${i}.ndjson`);
            if (fs.existsSync(filePath)) {
                console.log(`Reconstructing index ${i} from log file...`);
    
                const keyLatestState = {}; // Temporary storage for the latest key-value states
    
                const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
                const rl = readline.createInterface({
                    input: stream,
                    crlfDelay: Infinity
                });
    
                for await (const logLine of rl) {
                    if (logLine.trim()) {
                        try {
                            const { operation, key, value } = JSON.parse(logLine);
    
                            if (operation === 'set') {
                                keyLatestState[key] = value; // Store the latest set value
                            } else if (operation === 'delete') {
                                // Mark the key as deleted
                                keyLatestState[key] = null;
                            }
                        } catch (e) {
                            console.error(`Failed to parse log line: ${logLine}`);
                            console.error(e);
                        }
                    }
                }
    
                // Now we create a new compacted log without any redundant 'delete' operations
                const compactedLog = [];
                for (const [key, value] of Object.entries(keyLatestState)) {
                    if (value !== null) {
                        // If there's a value, log the 'set' operation
                        this.setKey(i, key, value, false);
                        compactedLog.push(JSON.stringify({ operation: 'set', key, value }));
                    }
                    // Skip the 'delete' entries entirely, as they should not persist in the log
                }
    
                // Write the cleaned log back to the file
                fs.writeFileSync(filePath, compactedLog.join('\n') + '\n', { encoding: 'utf-8' });
                console.log(`Reconstruction and compaction of index ${i} completed, all 'delete' entries removed.`);
            }
        }
    }    
    
    

    /**
     * Writes the log entry for a set or delete operation into the corresponding index file.
     * Uses NDJSON format for better resilience and readability.
     * 
     * @param {number} index - The index number (0-15) where the operation occurred.
     * @param {string} operation - The operation being performed: either 'set' or 'delete'.
     * @param {string} key - The key being set or deleted.
     * @param {boolean} logOperation - Whether to log the operation (defaults to true).
     */
    async writeLog(index, operation, key, logOperation = true) {
        if (logOperation) {
            const filePath = path.join(this.logDir, `${index}.ndjson`);
            const logEntry = {
                operation,
                key: key.toString(),
                value: operation === 'set' ? this.indexes[index][key] : undefined
            };
            fs.appendFileSync(filePath, JSON.stringify(logEntry) + '\n', { encoding: 'utf-8' });
        }
    }

    /**
     * Retrieves all keys stored in a specific index.
     * 
     * @param {number} index - The index (0-15) from which to retrieve the keys.
     * @returns {string[]} An array of strings representing all keys in the specified index.
     */
    async getAllKeys(index) {
        return Object.keys(this.indexes[index] || {});
    }

    /**
     * Retrieves `n` keys from a specific index, with pagination and order options.
     * 
     * @param {number} index - The index (0-15) from which to retrieve the keys.
     * @param {number} n - The number of keys to retrieve.
     * @param {number} page - The set of keys to retrieve (pagination offset).
     * @param {string} [order='normal'] - The order of keys ('normal' or 'reverse').
     * @returns {string[]} An array of strings representing the requested `n` keys in the specified index.
     */
    async getNKeys(index, n, page, order = 'normal') {
        const allKeys = await this.getAllKeys(index);

        // Handle ordering
        const orderedKeys = order === 'reverse' ? allKeys.reverse() : allKeys;

        // Calculate the offset and return the slice
        const start = page * n;
        return orderedKeys.slice(start, start + n);
    }

    async getIndexContent(index) {
        return this.indexes[index];
    }

    /**
     * Searches for keys that match a given regex pattern in a specific index.
     * 
     * @param {number} index - The index (0-15) to search within.
     * @param {string} pattern - A regex pattern string to search for within the keys.
     * @returns {Promise<string[]>} An array of strings representing all keys that match the given pattern.
     */
    async searchKeys(index, pattern) {
        const regex = new RegExp(pattern);
        const allKeys = await this.getAllKeys(index); // Await the promise
        return allKeys.filter((key) => regex.test(key)); // Now filter can be used on the resolved array
    }

    /**
     * Sets a key-value pair in a specific index, and logs the operation with the entire object stored in memory.
     * Preserves the data type of the value (e.g., array, object, string, etc.).
     * 
     * @param {number} index - The index (0-15) where the key-value pair should be stored.
     * @param {string} key - The key to be added or updated in the index.
     * @param {*} value - The value to be associated with the key. Can be any valid JavaScript object.
     * @param {boolean} logOperation - Whether to log the operation (defaults to true).
     */
    async setKey(index, key, value, logOperation = true) {
        // Ensure the index exists and is properly initialized
        if (!this.indexes[index]) {
            this.indexes[index] = {}; // Initialize the index if not already done
            console.log(`Initialized index ${index} as an empty object.`);
        }
    
        this.indexes[index][key] = value;
        console.log(`Set key '${key}' in index ${index}. Value:`, value);
        await this.writeLog(index, 'set', key, logOperation);
    }

    /**
     * Retrieves the value associated with a key from a specific index.
     * 
     * @param {number} index - The index (0-15) to search within.
     * @param {string} key - The key whose value should be retrieved.
     * @returns {*} The value associated with the key, or null if the key does not exist.
     */
    async getKey(index, key) {
        return this.indexes[index][key] || null;
    }

    /**
     * Deletes a key from a specific index and logs the operation.
     * 
     * @param {number} index - The index (0-15) from which the key should be deleted.
     * @param {string} key - The key to be removed from the index.
     * @param {boolean} logOperation - Whether to log the operation (defaults to true).
     */
    async deleteKey(index, key, logOperation = true) {
    
        // Check if the key exists before attempting deletion
        if (!this.indexes[index][key]) {
            console.error(`Conflict 409: Key ${key} does not exist in index ${index}`);
            return; // Exit the function if the key doesn't exist
        } else {
            console.log(`Deleting key: ${key} from index: ${index}`);
            delete this.indexes[index][key]; // Remove the key from memory
            await this.writeLog(index, 'delete', key, logOperation); // Log the deletion
            console.log(`Key ${key} deleted successfully from index ${index}`);
        }
    }

    /**
     * Returns the next available ID for a specified index DB.
     * It finds the highest existing in-memory ID and returns one greater than that.
     * 
     * @param {number} index - The index (0-15) from which to generate a new ID.
     * @returns {Promise<number>} The new ID for the next entry.
     */
    async getNewID(index) {
        const allKeys = await this.getAllKeys(index); // Await the promise here

        if (!Array.isArray(allKeys)) {
            throw new Error("Expected allKeys to be an array, but got: " + typeof allKeys);
        }

        let maxId = 0;

        for (const key of allKeys) {
            const data = await this.getKey(index, key);
            if (data && typeof data.id === 'number') {
                maxId = Math.max(maxId, data.id);
            }
        }

        return maxId + 1;
    }
}

module.exports = { butterfly, db: new butterfly() };
