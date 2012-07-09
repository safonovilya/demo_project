var t = require('./../core/thread');
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
        self.repository.insertThread(thread, function(error, threadsInDB){
            if (error){
                test.ok(false);
                test.done();
            }
            for (var i = 0; i < threadsInDB.length; i++  ){
                (function (i){
                    self.repository.findThreadByID(threadsInDB[i].id, function(error, threadsFound){
                        if (error){
                            test.ok(false);
                            test.done();
                        }
                        test.equals(threadsFound.msgText, thread.msgText);
                        test.done();
                    });
                })(i);
            }
        });
    },

    testThreadSaveTree: function(test){
        var self = this;
        var thread = new t.Thread('msg', 'author');
        self.repository.insertThread(thread, function(error, threadInDB){
            if (error){
                test.ok(false);
                test.done();
            }
            var threadChild = new t.Thread('reMsg', 'new author', threadInDB[0]);
            self.repository.insertThread(threadChild,function(errror, threadChildInDB){
                if (error){
                    test.ok(false);
                    test.done();
                }
                test.equals(threadChildInDB[0].parentID, threadInDB[0].id);
                test.done();
                self.repository.close();
            });
        });
    },

    testThreadConstruct: function(test){
        var self = this,
            thread = new t.Thread('msg', 'author');
        self.repository.insertThread(thread, function(error, threadInDB){
            if (error){
                test.ok(false);
                test.done();
            }
            var threadChild = new t.Thread('reMsg', 'new author', threadInDB[0]);
            self.repository.insertThread(threadChild,function(error, threadChildInDB){
                if (error){
                    test.ok(false);
                    test.done();
                }
                self.repository.findThreadByID(threadInDB[0].id, function(error, threadTree){
                    if (error){
                        test.ok(false);
                        test.done();
                    }
                    test.equals(threadTree.getChild(0).parentID.toString(), threadChildInDB[0].parentID.toString());
                    test.done();
                });
            });
        });
    },

    testThreadConstructSubChild: function(test){
        var self = this,
            thread = new t.Thread('msg', 'author');
        self.repository.insertThread(thread, function(error, threadInDB){
            if (error){
                test.ok(false);
                test.done();
            }
            var threadChild = new t.Thread('reMsg', 'new author', threadInDB[0]);
            self.repository.insertThread(threadChild, function(error, threadChildInDB){
                if (error){
                    test.ok(false);
                    test.done();
                }
                var subThreadChild = new t.Thread('reReMsg', 'new new author', threadChildInDB[0]);
                self.repository.insertThread(subThreadChild, function(error, threadSubChildInDB){
                    if (error){
                        test.ok(false);
                        test.done();
                    }
                    self.repository.findThreadByID(threadInDB[0].id, function(error, threadTree){
                        if (error){
                            test.ok(false);
                            test.done();
                        }
                        test.equals(threadTree.getChild(0).getChildCount(), 1);
                        test.done();
                    });
                });
            });
        });
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