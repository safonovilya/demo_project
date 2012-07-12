var Class = require('./../libs/class'),
    t = require('./../core/thread'),
    mongodb = require('mongodb'),
    async = require('async'),
    ObjectID = require('mongodb').ObjectID;


exports.Repository = Class.extend({
    init: function() {
        var server = new mongodb.Server("127.0.0.1", 27017, {});
        this.db = new mongodb.Db('demoProject', server, {});
    },

    removeAllThreads: function(callback) {
        var self = this;
        async.waterfall([
            function(callback) {
                self.client.collection('threads', callback);
            },
            function(collection, callback) {
                collection.remove({}, callback);
            }
        ],
            callback
        );
    },

    insertThread: function(thread, callback){
        var self = this;
        async.waterfall([
                function(callback) {
                    self.client.collection('threads', callback);
                },
                function(collection, callback) {
                    collection.insert(thread.getDoc(), callback);
                },
                function(docs, callback) {
                    thread.setFromDoc(docs[0]);
                    callback(null, thread);
                }
            ],
            callback
        );
    },
    findThreadByID: function(id, callback){
        var self = this;
        id = id.toString();
        async.waterfall(
            [
                function(callback){
                    self.client.collection('threads', callback);
                },
                function(collection, callback){
                    collection.find({$or: [{_id: new ObjectID(id)}, {parentID: new ObjectID(id)}, {parents: id}]}, {}, callback);
                },
                function(cursor, callback){
                    cursor.toArray(callback);
                },
                function(docs ,callback){

                    console.log(id);
                    console.log(docs);
                    var thread;
                    for(var i = 0; i < docs.length; i++){
                        if (docs[i]._id.toString() == id.toString()){
                            thread = new t.Thread();
                            thread.setFromDoc(docs[i]);
                            docs.splice(i, 1);
                            thread = self.buildTree(thread,docs);
                            break;
                        }
                    }
                    callback(null, thread);
                }
            ],
            callback
        );
    },

    buildTree: function(rootThread, arrayDocs){
        var self = this;
        async.forEach(
            arrayDocs,
            function(item, callback){
                if (item.parentID && item.parentID.toString() == rootThread.id){
                    var thread = new t.Thread();
                    thread.setFromDoc(item);
                    thread = self.buildTree(thread,arrayDocs);
                    rootThread.addChild(thread);
                }
                callback();
            },
            function(error){
                return rootThread;
            }
        );
//        for(var i = 0; i < arrayDocs.length; i++){
//            if (arrayDocs[i].parentID && arrayDocs[i].parentID.toString() == rootThread.id){
//                var thread = new t.Thread();
//                thread.setFromDoc(arrayDocs[i]);
//                arrayDocs.splice(i, 1);
//                thread = this.buildTree(thread,arrayDocs);
//                rootThread.addChild(thread);
//            }
//        }
//        return rootThread;
    },

    getMainThread: function(callback){
        var self = this;

        async.waterfall(
            [
                function(callback){
                    self.client.collection('threads', callback);
                },
                function(collection, callback){
                    collection.find({}, {}, callback);
                },
                function(cursor, callback){
                    cursor.toArray(callback);
                },
                function(docs){
                    var thread;
                    for(var i = 0; i < docs.length; i++){
                        if (docs[i].parentID == null){
                            thread = new t.Thread(docs[i].msgText, docs[i].author);
                            thread.id = docs[i]._id;
                            docs.splice(i, 1);
                            thread = self.buildTree(thread,docs);
                            break;
                        }
                    }
                    callback(null, thread);
                }
            ],
            callback
        );
    },

    open: function(callback){
        var self = this;
        this.db.open(function(error, client){
            if (error) {
                callback (error);
            } else {
                self.client = client;
                callback(null);
            }
        });
    },

    close: function(callback){
        this.client.close(callback);
    }

});
