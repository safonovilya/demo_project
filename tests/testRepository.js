var t = require('./../core/thread');
var async = require('async');
var r = require('./../core/repository');

exports.repositoryTest = {

    setUp: function(done) {
        var self = this;
        this.repository = new r.Repository();
        async.waterfall([
            function(callback) {
                self.repository.open(callback);
            },
            function (callback) {
                self.repository.removeAllThreads(callback);
            }
        ],
        done);
    },

    tearDown: function(done) {
        this.repository.close(done);
    },

    testThreadInsert: function(test){
        var self = this;

        var thread = new t.Thread('testThreadInsert','author');
        async.waterfall([
                function(callback) {
                    self.repository.insertThread(thread, callback);
                },
                function(threadInDB, callback) {
                    console.log(threadInDB.id);
                    self.repository.findThreadByID(threadInDB.id, callback);
                },
                function(threadFound, callback) {
                    console.log(threadFound);
                    test.equals(threadFound.msgText, thread.msgText);
                    test.equals(threadFound.parents.length, 0);
                    callback();
                }
            ],
            test.done
        );
    },

    testThreadSaveTree: function(test){
        var self = this;
        var thread = new t.Thread('msg', 'testThreadSaveTree');
        async.waterfall([
            function(callback){
                self.repository.insertThread(thread, callback);
            },
            function(threadInDB, callback){
                thread = threadInDB;
                var threadChild = new t.Thread('reMsg', 'new testThreadSaveTree', threadInDB);
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
                    console.log(threadTree);
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
                    console.log(threadInDB);
                    var threadChild = new t.Thread('reMsg', 'new author', threadInDB);
                    self.repository.insertThread(threadChild, callback);
                },
                function(threadChildInDB, callback){
                    console.log(threadChildInDB);
                    var subThreadChild = new t.Thread('reReMsg', 'new new author', threadChildInDB);
                    self.repository.insertThread(subThreadChild, callback);
                },
                function(threadSubChildInDB, callback){
                    console.log(threadSubChildInDB);
                    self.repository.findThreadByID(thread.id, callback);
                },
                function(threadTree, callback){
                    console.log(threadTree);
                    test.equals(threadTree.parents.length, 0);
                    test.equals(threadTree.getChild(0).getChildCount(), 1);
                    callback();
                }
            ],
            test.done
        );
    },

    testGetListThread: function(test){
        var self = this,
            thread = new t.Thread('mainThread', 'author');

        async.waterfall(
            [
                function(callback){
                    self.repository.insertThread(thread, callback);
                },
                function(threadInDB, callback){
                    self.repository.getMainThread(callback);
                },
                function(mainThread, callback){
                    test.equals(mainThread.msgText, "mainThread");
                    callback();
                }
            ],
            test.done
        );
    },

    testGetMainThread: function(test){
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
                    var threadChild = new t.Thread('reMsg', 'new author', thread);
                    self.repository.insertThread(threadChild, callback);
                },
                function(threadSubChildInDB, callback){
                    self.repository.getMainThread(callback);
                },
                function(threadTree, callback){
                    console.log(threadTree);
                    test.equals(threadTree.parents.length, 0);
                    test.equals(threadTree.getChildCount(), 2);
                    test.equals(threadTree.getChild(0).parents.length, 1);
                    test.equals(threadTree.getChild(0).getChild(0).parents.length, 2);
                    callback();
                }
            ],
            test.done
        );
    }


};
