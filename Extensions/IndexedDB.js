// Name: IndexedDB_Utils
// By: @mistium on discord
// Description: Access and write to IndexedDB.

(function(Scratch) {
  "use strict";

  class IndexedDBExtension {
    constructor() {
      // Initialize IndexedDB
      this.dbName = "scratchDB"; // Default database name
      this.dbVersion = 1;
      this.db;
    }

    getInfo() {
      return {
        id: 'indexeddbutils',
        name: 'IndexedDB Utils',
        blocks: [{
            opcode: 'setDBName',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set database name to [NAME]',
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "scratchDB"
              }
            }
          },
          {
            opcode: 'writeToDatabase',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create Key [KEY] and set it to [VALUE]',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ""
              },
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'readFromDatabase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Read value [KEY]',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'getAllKeys',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get all keys from database',
          },
          {
            opcode: 'keyExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Key [KEY] exists in database?',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'deleteFromDatabase',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Delete value with key [KEY] from database',
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "data"
              }
            }
          },
          {
            opcode: 'exportDatabaseAsJSON',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Export database as JSON',
          },
          {
            opcode: 'importJSONToDatabase',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Import [jsonData] into database',
            arguments: {
              jsonData: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "{}"
              }
            }
          },
        ]
      };
    }

    setDBName({
      NAME
    }) {
      this.dbName = NAME;
      this.initializeDatabase(); // Re-initialize the database with the new name
    }

    initializeDatabase() {
      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = function(event) {
        console.error("IndexedDB error:", event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log("IndexedDB initialized successfully!");
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        const objectStore = this.db.createObjectStore("data", {
          keyPath: "key"
        });
        console.log("IndexedDB upgrade complete!");
      };
    }

    writeToDatabase({
      VALUE,
      KEY
    }) {
      const transaction = this.db.transaction(["data"], "readwrite");
      const objectStore = transaction.objectStore("data");
      objectStore.put({
        key: KEY,
        value: VALUE
      });
    }

    async readFromDatabase({
      KEY
    }) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.get(KEY);
        request.onsuccess = function(event) {
          resolve(event.target.result ? event.target.result.value : null);
        };
        request.onerror = function(event) {
          reject("Error reading from database");
        };
      });
    }

    async getAllKeys() {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.getAllKeys();
        request.onsuccess = function(event) {
          const keysArray = event.target.result;
          const keysJSON = JSON.stringify(keysArray); // Convert array to JSON string
          resolve(keysJSON);
        };
        request.onerror = function(event) {
          reject("Error getting keys from database");
        };
      });
    }


    async keyExists({
      KEY
    }) {
      const keys = await this.getAllKeys();
      return keys.includes(KEY);
    }

    deleteFromDatabase({
      KEY
    }) {
      const transaction = this.db.transaction(["data"], "readwrite");
      const objectStore = transaction.objectStore("data");
      objectStore.delete(KEY);
    }

    async exportDatabaseAsJSON() {
      if (!this.db) {
        return Promise.reject("No database connection available");
      }

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(["data"], "readonly");
        const objectStore = transaction.objectStore("data");
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
          const data = event.target.result;
          try {
            const formattedData = {};
            data.forEach(entry => {
              formattedData[entry.key] = entry.value;
            });
            const jsonData = JSON.stringify(formattedData);
            resolve(jsonData);
          } catch (error) {
            reject("Error converting data to JSON");
          }
        };

        request.onerror = function(event) {
          reject("Error exporting database as JSON");
        };
      });
    }
    async importJSONToDatabase({jsonData}) {
    if (!this.db) {
        return Promise.reject("No database connection available");
    }

    return new Promise((resolve, reject) => {
        try {
            const data = JSON.parse(jsonData);
            const transaction = this.db.transaction(["data"], "readwrite");
            const objectStore = transaction.objectStore("data");

            Object.keys(data).forEach(key => {
                objectStore.put({ key: key, value: data[key] });
            });

            transaction.oncomplete = function() {
                resolve("Data imported successfully");
            };

            transaction.onerror = function(event) {
                reject("Error importing data into database");
            };
        } catch (error) {
            reject("Error parsing JSON data");
        }
    });
}

  }
  Scratch.extensions.register(new IndexedDBExtension());
})(Scratch);
