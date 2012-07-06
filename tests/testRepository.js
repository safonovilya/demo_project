var t = require('./../core/thread');
var r = require('./../core/repository');
exports.repositoryTest = {

    testThreadInsert: function(test){

       var thread = new t.Thread('msg','author');
       repository = new r.Repository();
       repository.open(function(){
           repository.insertThread(thread, function(threadInDB){
               repository.findThreadByID(threadInDB._id, function(threadFound){
                   test.equals(threadInDB.msgText,threadFound.msgText);
                   test.done();
                   repository.close();
               });
           });

       });
    },

    testThreadSaveTree: function(test){
        var thread = new t.Thread('msg', 'author'),
            threadChild = new t.Thread('reMsg', 'new author');
        repository = new r.Repository();
        repository.open(function(){
            repository.insertThread(thread, function(threadInDB){
                repository.findThreadByID(threadInDB._id, function(threadFound){
                    threadFound.addChild(threadChild);
                    repository.updateThread(threadFound,function(threadUpdated){
                        test.equals(threadUpdated.getChildCount(),1);
                        repository.getThreadCount(function(count){
                            test.equals(count,2);
                            test.done();
                            repository.close();
                        });
                    });
                });
            });

        });
    }
};