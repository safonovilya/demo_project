var Class = require('./../libs/class');
var t = require('./../core/thread');
var mongodb = require('mongodb');


exports.Repository = Class.extend({
    init: function() {
        var server = new mongodb.Server("127.0.0.1", 27017, {});
        this.db = new mongodb.Db('demoProject', server, {});
    },

    insertThread: function(thread, callback){

        this.client.collection('threads', function(err, collection){
            collection.insert(thread ,function(err,docs){
                if (err) {
                    this.close();
                    throw err;
                }
                var threads = [];
                for (var i = 0; i<docs.length; i++){
                    thread.id = docs[i]._id;
                    threads[threads.length] = thread;
                }
                callback(threads);
            });
        });
    },
    findThreadByID: function(id,callback){
        var self = this;
        this.client.collection('threads', function(err, collection){
            collection.find( {$or : [{_id: id},{parentID: id}, {parents: id.toString()}]}, {}, function(err, cursor){

                cursor.toArray(function(err, docs){
                    for(var i = 0; i < docs.length; i++){
                        if (docs[i]._id.toString() == id){
                            var thread = new t.Thread(docs[i].msgText, docs[i].author);
                            thread.id = id;
                            docs.splice(i,1);
                            thread = self.buildTree(thread,docs);
                            console.log(thread);
                            callback(thread);
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
            if (error) throw error;
            self.client = client;
            callback();
        });
    },

    close: function(done){
        this.client.close(done);
    }

});