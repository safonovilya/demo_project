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
                    var thread = new t.Thread(docs[i].msgText, docs[i].author, docs[0].parentID);
                    thread.id = docs[i]._id;
                    // TODO: собрать детей each(docs[0].child, function(child){thread.addChild(child);})
                    threads[threads.length] = thread;
                }
                callback(threads);
            });
        });
    },
    findThreadByID: function(id,callback){
        this.client.collection('threads', function(err, collection){
            collection.find( {$or : [{_id: id},{parentID: id}]}, {}, function(err, cursor){

                var threads = cursor.toArray(function(err, docs){
                    var childs = [];
                    var thread = new t.Thread();

                    for(var i = 0; i < docs.length; i++){
                        if (docs[i]._id.toString() == id){
                            thread.msgText = docs[i].msgText;
                            thread.author = docs[i].author;
                            thread.id = docs[i]._id;
                        } else {
                            var threadChild = new t.Thread(docs[i].msgText, docs[i].author, docs[i].parentID);
                            threadChild.id = docs[i]._id;
                            childs[childs.length] = threadChild;
                        }
                    }
                    for (var i = 0; i < childs.length; i++){
                        if (childs[i].parentID.toString() == id){
                            thread.addChild(childs[i]);
                        } else {
                            // TODO: subChild
                        }
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