var Class = require('./../libs/class');
var t = require('./../core/thread');
var mongodb = require('mongodb');
var async = require('async');


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
                    collection.find({$or: [{_id: id}, {parentID: id}, {parents: id.toString()}]}, {}, callback);
                },
                function(cursor, callback){
                    cursor.toArray(callback);
                },
                function(docs){
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
            if (arrayDocs[i].parentID.toString() == rootThread.id){
                var thread = new t.Thread(arrayDocs[i].msgText, arrayDocs[i].author, rootThread);
                thread.id = arrayDocs[i]._id;
                arrayDocs.splice(i,1);
                thread = this.buildTree(thread,arrayDocs);
                rootThread.addChild(thread);
            }
        }
        return rootThread;
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