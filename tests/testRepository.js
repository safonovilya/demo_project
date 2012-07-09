var t = require('./../core/thread');
var r = require('./../core/repository');
exports.repositoryTest = {

    setUp: function(done) {
        this.repository = new r.Repository();
        this.repository.open(function(){
            done();
        });
    },

    tearDown: function(done) {
        this.repository.close(done);
    },

    testThreadInsert: function(test){
        var self = this;
        var thread = new t.Thread('msg','author');
        self.repository.insertThread(thread, function(threadInDBs){
            for (var i = 0; i < threadInDBs.length; i++  ){
                (function (i){
                    self.repository.findThreadByID(threadInDBs[i].id, function(threadsFound){
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
        self.repository.insertThread(thread, function(threadInDB){
            var threadChild = new t.Thread('reMsg', 'new author', threadInDB[0].id);
            self.repository.insertThread(threadChild,function(threadChildInDB){
                test.equals(threadChildInDB[0].parentID, threadInDB[0].id);
                test.done();
                self.repository.close();
            });
        });
    },

    testThreadConstruct: function(test){
        var self = this,
            thread = new t.Thread('msg', 'author');
        self.repository.insertThread(thread, function(threadInDB){
            var threadChild = new t.Thread('reMsg', 'new author', threadInDB[0].id);
            self.repository.insertThread(threadChild,function(threadChildInDB){
                self.repository.findThreadByID(threadInDB[0].id, function(threadTree){
                    test.equals(threadTree.getChild(0).parentID.toString(), threadChildInDB[0].parentID.toString());
                    test.done();
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