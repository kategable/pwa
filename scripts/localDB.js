var localDB = (function () {
    var module = {};
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    //check for support
    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        alert("no indexDB here")
        return;
    }
    var dbPromise = new Promise(function (fulfill, reject) {
        const dbName = "myPWATestDB";
        const dbVersion = 1;
        var dataBase = indexedDB.open(dbName, dbVersion);
        dataBase.onerror = function (event) {
            reject(event.target.errorCode);

            //alert("Why didn't you allow my web app to use IndexedDB?!");
        };
        dataBase.onsuccess = function (event) {
            db = event.target.result;
            fulfill(db);

            db.onerror = function (event) {
                // Generic error handler for all errors targeted at this database's
                // requests!
                alert("Database error: " + event.target.message);
                reject(event.target.errorCode);

            };
        };
        dataBase.onupgradeneeded = function (e) {

            var active = dataBase.result;
            var objectDb = active.createObjectStore("cart", { keyPath: 'id', autoIncrement: true });

        };
        //request.onupgradeneeded = function (event) {
        //    // return;
        //    var db = event.target.result;

        //    // Create an objectStore to hold information about our customers. We're
        //    // going to use "ssn" as our key path because it's guaranteed to be
        //    // unique - or at least that's what I was told during the kickoff meeting.
        //    var objectStore = db.createObjectStore("cart", { keyPath: "id" });

        //    return;
        //    // Create an index to search customers by name. We may have duplicates
        //    // so we can't use a unique index.
        //    //objectStore.createIndex("name", "name", { unique: false });

        //    // Create an index to search customers by email. We want to ensure that
        //    // no two customers have the same email, so use a unique index.
        //    //objectStore.createIndex("email", "email", { unique: true });

        //    // Use transaction oncomplete to make sure the objectStore creation is 
        //    // finished before adding data into it.
        //    objectStore.transaction.oncomplete = function (event) {
        //        // Store values in the newly created objectStore.
        //        var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
        //        const customerData = [
        //            { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
        //            { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
        //        ];
        //        for (var i in customerData) {
        //            customerObjectStore.add(customerData[i]);
        //        }
        //    };
        //};
    });


    module.addObject = function (objectName, data, keyName) {
        return new Promise(function (fulfill, reject) {
            dbPromise.then(function (db) {
                var transaction = db.transaction([objectName], "readwrite");


                // Do something when all the data is added to the database.
                transaction.oncomplete = function (event) {
                    fulfill(true);
                };

                transaction.onerror = function (event) {
                    reject(event);
                };

                var objectStore = transaction.objectStore(objectName);

                var request = objectStore.add(data);
                request.onsuccess = function (event) {
                    event.target.result == data[keyName];
                };

            });
        });
    }

    module.deleteObject = function (objectName, key) {

        return new Promise(function (fulfill, reject) {
            dbPromise.then(function (db) {
                var request = db.transaction([objectName], "readwrite")
                    .objectStore(objectName)
                    .delete(key);
                request.onsuccess = function (event) {
                    try {
                        fulfill(true);
                    } catch (ex) {
                        reject(ex);
                    }
                };

                request.onerror = function (event) {
                    reject(event);
                }

            });
        });
    }

    module.getObject = function (objectName, key) {

        return new Promise(function (fulfill, reject) {
            dbPromise.then(function (db) {
                var transaction = db.transaction([objectName], "readwrite");
                var request = transaction.objectStore(objectName).get(key);
                request.onsuccess = function (event) {
                    try {
                        fulfill(event.target.result);
                    } catch (ex) {
                        reject(ex);
                    }
                };
                request.onerror = function (event) {
                    reject(event);

                }

            });
        });
    }

    module.getAll = function (objectName) {
        return new Promise(function (fulfill, reject) {
            dbPromise.then(function (db) {
                var transaction = db.transaction([objectName], "readwrite");
                var request = transaction.objectStore(objectName).openCursor();//.onsuccess = function (event) {              
                request.onsuccess = function (event) {
                    try {
                        var items = [];
                        var cursor = event.target.result;
                        if (cursor) {
                            items.push(cursor.value);
                            cursor.continue();
                        }
                        fulfill(items);
                    } catch (ex) {
                        reject(ex);
                    }
                };
                request.onerror = function (event) {
                    reject(event);
                }

            });
        });


    }

    return module;


})();
