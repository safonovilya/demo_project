var Class = require('./../libs/class');
var t = require('./../core/thread');
var mongodb = require('mongodb');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;


exports.Repository = Class.extend({
    init: function() {
        var server = new mongodb.Server("127.0.0.1", 27017, {});
        this.db = new mongodb.Db('demoProject', server, {});
    },

    insertThread: function(thread, callback){
        var self = this;
        async.waterfall([
                function(callback) {
                    self.client.collection('threads', callback);
                },
                function(collection, callback) {
                    collection.insert(thread, callback);
                },
                function(docs, callback) {
                    thread.id = docs[0]._id;
                    callback(null, thread);
                }
            ],
            callback
        );
    },
    findThreadByID: function(id, callback){
        var self = this;

        async.waterfall(
            [
                function(callback){
                    self.client.collection('threads', callback);
                },
                function(collection, callback){
                    collection.find({$or: [{_id: new ObjectID(id)}, {parentID: id}, {parents: id}]}, {}, callback);
                },
                function(cursor, callback){
                    cursor.toArray(callback);
                },
                function(docs){
                    console.log(docs);
                    for(var i = 0; i < docs.length; i++){
                        if (docs[i]._id.toString() == id){
                            var thread = new t.Thread(docs[i].msgText, docs[i].author);
                            thread.id = id;
                            docs.splice(i, 1);
                            thread = self.buildTree(thread,docs);
                            callback(null, thread);
                            break;
                        }
                    }
                }
            ],
            callback
        );
    },

    buildTree: function(rootThread, arrayDocs){
        for(var i = 0; i < arrayDocs.length; i++){
            if (arrayDocs[i].parentID && arrayDocs[i].parentID.toString() == rootThread.id){
                var thread = new t.Thread(arrayDocs[i].msgText, arrayDocs[i].author, rootThread);
                thread.id = arrayDocs[i]._id;
                arrayDocs.splice(i,1);
                thread = this.buildTree(thread,arrayDocs);
                rootThread.addChild(thread);
            }
        }
        return rootThread;
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
                    for(var i = 0; i < docs.length; i++){
                        if (docs[i].parentID == null){
                            var thread = new t.Thread(docs[i].msgText, docs[i].author);
                            thread.id = docs[i]._id;
                            docs.splice(i, 1);
                            thread = self.buildTree(thread,docs);
                            callback(null, thread);
                            break;
                        }
                    }
                    callback(-1);
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