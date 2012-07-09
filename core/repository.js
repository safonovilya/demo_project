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
        this.client.collection('threads', function(err, collection){
            collection.find( {$or : [{_id: id},{parentID: id}]}, {}, function(err, cursor){

                cursor.toArray(function(err, docs){

                    var subChildren = [];
                    var thread = new t.Thread();
                    thread.id = id;
                    for(var i = 0; i < docs.length; i++){
                        if (docs[i]._id.toString() == id){
                            thread.msgText = docs[i].msgText;
                            thread.author = docs[i].author;
                        } else {
                            var threadChild = new t.Thread(docs[i].msgText, docs[i].author, thread);
                            threadChild.id = docs[i]._id;
                            if (threadChild.parentID.toString() == id){
                                thread.addChild(threadChild);
                            } else {
                                // TODO: add to threadChildren subChildren
                                subChildren[subChildren.length] = threadChild;
                            }
                        }
                    }
                    for(var i = 0; i < subChildren.length; i++){
                        console.log(subChildren[i].parentID);
                        console.log(thread.getChildrenByID(subChildren[i].parentID));
                        thread.getChildrenByID(subChildren[i].parentID).addChild(subChildren);
                    }

                    callback(thread);
                });
            });
        });
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