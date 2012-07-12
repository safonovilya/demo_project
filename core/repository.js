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
                    collection.find({$or: [{_id: new ObjectID(id)}, {parentID: new ObjectID(id)}, {parents: new ObjectID(id)}]}, {}, callback);
                },
                function(cursor, callback){
                    cursor.toArray(callback);
                },
                function(docs ,callback){
                    var thread;
                    async.forEach(
                        docs,
                        function(item, callback){
                            if (item._id.toString() == id){
                                thread = new t.Thread();
                                thread.setFromDoc(item);
                                self.findChildren(thread, docs, function(child){
                                    callback();
                                });
                            } else {
                                callback();
                            }
                        },
                        function(error){
                            callback(null, thread);
                        }
                    );
                }
            ],
            callback
        );
    },

    findChildren: function(rootThread, docs, callback){
        var self = this;
        var children = [];
        async.forEach(
            docs,
            function(item, callback){
                if (item.parentID && item.parentID.toString() == rootThread.id){
                    var thread = new t.Thread();
                    thread.setFromDoc(item);
                    self.findChildren(thread, docs, function(child){
                        callback();
                    });
                    children.push(thread);
                } else {
                    callback();
                }
            },
            function(error){
                rootThread.child = children;
                callback(rootThread);
            }
        );
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

                    async.forEach(
                        docs,
                        function(item, callback){
                            if (item.parentID == null){
                                thread = new t.Thread(item.msgText, item.author);
                                thread.setFromDoc(item);
                                self.findChildren(thread, docs, function(child){
                                    callback();
                                });
                            } else {
                                callback();
                            }
                        },
                        function(error){
                            if (thread){
                                callback(null, thread);
                            } else {
                                callback("nobody");
                            }
                        }
                    );
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
