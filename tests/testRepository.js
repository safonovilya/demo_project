var t = require('./../core/thread');
var async = require('async');
var r = require('./../core/repository');

exports.repositoryTest = {

    setUp: function(done) {
        this.repository = new r.Repository();
        this.repository.open(function(error){
            if (error){
                test.ok(false);
                test.done();
            }
            done();
        });
    },

    tearDown: function(done) {
        this.repository.close(done);
    },

    testThreadInsert: function(test){
        var self = this;

        var thread = new t.Thread('msg','author');
        async.waterfall([
                function(callback) {
                    self.repository.insertThread(thread, callback);
                },
                function(threadInDB, callback) {
                    self.repository.findThreadByID(threadInDB.id, callback);
                },
                function(threadFound, callback) {
                    test.equals(threadFound.msgText, thread.msgText);
                    callback();
                }
            ],
            test.done
        );
    },

    testThreadSaveTree: function(test){
        var self = this;
        var thread = new t.Thread('msg', 'author');
        async.waterfall([
            function(callback){
                self.repository.insertThread(thread, callback);
            },
            function(threadInDB, callback){
                thread = threadInDB;
                var threadChild = new t.Thread('reMsg', 'new author', threadInDB);
                self.repository.insertThread(threadChild, callback);
            },
            function(threadChildInDB, callback){
                test.equals(threadChildInDB.parentID, thread.id);
                callback();
            }
        ],
        test.done
        );
    },

    testThreadConstruct: function(test){
        var self = this,
            thread = new t.Thread('msg', 'author'),
            threadChild;

        async.waterfall(
            [
                function(callback){
                    self.repository.insertThread(thread, callback);
                },
                function(threadInDB, callback){
                    thread = threadInDB;
                    var threadChild = new t.Thread('reMsg', 'new author', threadInDB);
                    self.repository.insertThread(threadChild, callback);
                },
                function(threadChildInDB, callback){
                    threadChild = threadChildInDB;
                    self.repository.findThreadByID(thread.id, callback);
                },
                function(threadTree, callback){
                    test.equals(threadTree.getChild(0).parentID.toString(), threadChild.parentID.toString());
                    callback();
                }
            ],
            test.done
        );
   },

    testThreadConstructSubChild: function(test){
        var self = this,
            thread = new t.Thread('msg', 'author');

        async.waterfall(
            [
                function(callback){
                    self.repository.insertThread(thread, callback);
                },
                function(threadInDB, callback){
                    thread = threadInDB;
                    var threadChild = new t.Thread('reMsg', 'new author', threadInDB);
                    self.repository.insertThread(threadChild, callback);
                },
                function(threadChildInDB, callback){
                    var subThreadChild = new t.Thread('reReMsg', 'new new author', threadChildInDB);
                    self.repository.insertThread(subThreadChild, callback);
                },
                function(threadSubChildInDB, callback){
                    self.repository.findThreadByID(thread.id, callback);
                },
                function(threadTree, callback){
                    test.equals(threadTree.getChild(0).getChildCount(), 1);
                    callback();
                }
            ],
            test.done
        );
    }
};
/*
{
    message: '',
    authr: '',
    _id: 11110,
    Parent: ObjectId(11111),
    Parents: [ObjectId(11111), ObjectId(11113), ObjectId(11112)]
}
*/