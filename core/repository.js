var Class = require('./../libs/class');
var mongodb = require('mongodb');


exports.Repository = Class.extend({
    init: function() {
        var server = new mongodb.Server("127.0.0.1", 27017, {});
        this.db = new mongodb.Db('demoProject', server, {});
    },

    insertThread: function(thread, callback){
        this.client.collection('threads', function(err, collection){
            collection.insert(thread ,function(err,docs){
                docs.each(function(err, doc){
                    var thread = new Thread(docs[0].msgText, docs[0].author);
                    thread.id = docs[0]._id;
                    // TODO: собрать детей each(docs[0].child, function(child){thread.addChild(child);})
                    callback(thread);
                });
            });
        });
    },

    findThreadByID: function(id,callback){
        this.client.collection('threads', function(err, collection){
            collection.find({_id:id}, {limit:1}, function(err, docs){
                    docs.toArray(function(err, docs){
                        callback(docs[0]);
                    });
            });
        });
    },

    open: function(callback){
        var self = this;
        this.db.open(function(error, client){
            if (error) throw error;
            self.client = client;
            callback();
        });
    },

    close: function(){
        this.client.close();
    }

});