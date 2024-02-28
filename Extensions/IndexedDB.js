// Name: IndexedDB_Utils
// By: @mistium on discord
// Description: Access and write to IndexedDB.

(function (Scratch) {
    "use strict";

    class IndexedDBExtension {
        constructor() {
            // Initialize IndexedDB
            this.dbName = "scratchDB"; // Default database name
            this.dbVersion = 1;
            this.db;
            this.initializeDatabase();
        }

        getInfo() {
            return {
                id: 'indexeddbutils',
                name: 'IndexedDB Utils',
                blocks: [
                    {
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
                        text: 'Write [VALUE] to database with key [KEY]',
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
                        text: 'Read value from database with key [KEY]',
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
                    }
                ]
            };
        }

        setDBName({ NAME }) {
            this.dbName = NAME;
            this.initializeDatabase(); // Re-initialize the database with the new name
        }

        initializeDatabase() {
            const request = window.indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = function (event) {
                console.error("IndexedDB error:", event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("IndexedDB initialized successfully!");
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                const objectStore = this.db.createObjectStore("data", { keyPath: "key" });
                console.log("IndexedDB upgrade complete!");
            };
        }

        writeToDatabase({ VALUE, KEY }) {
            const transaction = this.db.transaction(["data"], "readwrite");
            const objectStore = transaction.objectStore("data");
            objectStore.put({ key: KEY, value: VALUE });
        }

        async readFromDatabase({ KEY }) {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(["data"], "readonly");
                const objectStore = transaction.objectStore("data");
                const request = objectStore.get(KEY);
                request.onsuccess = function (event) {
                    resolve(event.target.result ? event.target.result.value : null);
                };
                request.onerror = function (event) {
                    reject("Error reading from database");
                };
            });
        }

        async getAllKeys() {
            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(["data"], "readonly");
                const objectStore = transaction.objectStore("data");
                const request = objectStore.getAllKeys();
                request.onsuccess = function (event) {
                    resolve(event.target.result);
                };
                request.onerror = function (event) {
                    reject("Error getting keys from database");
                };
            });
        }
    }

    Scratch.extensions.register(new IndexedDBExtension());
})(Scratch);
