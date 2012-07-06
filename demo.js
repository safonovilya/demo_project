var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
new mongodb.Db('demoProject', server, {}).open(function (error, client) {
    if (error) throw error;
    client.collection('threads', function(err, collection){

        collection.insert({name:'pony'},{safe:true},function(err, objs){
            if (err) throw err;
            console.log(objs); // objs contain inserted docs

            collection.find({}, {limit:10}, function(err, docs){
                docs.each(function(err, doc){
                    if (doc){
                        console.log(doc);
                    } else {
                        collection.remove({name:{$exists:true}}, {safe:true}, function(error, obj){
                            console.log(obj);
                            client.close();
                        });
                    }
                }); // end foreach
            }); // end find callback
        }); // end insert callback
    });
});