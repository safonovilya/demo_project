var Class = require('./../libs/class');
var t = require('./../core/thread');
var mongodb = require('mongodb');


exports.Repository = Class.extend({
    init: function() {
        var server = new mongodb.Server("127.0.0.1", 27017, {});
        this.db = new mongodb.Db('demoProject', server, {});
    },

    insertThread: function(thread, callback){

        this.client.collection('threads', function(error, collection){
            if (error) { callback(error); }
            collection.insert(thread ,function(error, docs){
                if (error) { callback(error); }
                var threads = [];
                for (var i = 0; i<docs.length; i++){
                    thread.id = docs[i]._id;
                    threads[threads.length] = thread;
                }
                callback(null, threads);
            });
        });
    },
    findThreadByID: function(id, callback){
        var self = this;
        this.client.collection('threads', function(error, collection){
            if (error) { callback(error); }
            collection.find( {$or : [{_id: id},{parentID: id}, {parents: id.toString()}]}, {}, function(err, cursor){

                cursor.toArray(function(error, docs){
                    if (error) { callback(error); }
                    for(var i = 0; i < docs.length; i++){
                        if (docs[i]._id.toString() == id){
                            var thread = new t.Thread(docs[i].msgText, docs[i].author);
                            thread.id = id;
                            docs.splice(i,1);
                            thread = self.buildTree(thread,docs);
                            callback(null, thread);
                            break;
                        };
                    }
                });
            });
        });
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

    updateThread: function(thread, callback){


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

    close: function(done){
        this.client.close(done);
    }

});