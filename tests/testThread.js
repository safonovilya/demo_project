var t = require('./../core/thread');

exports.StructureTest = {

    testRootMessage: function(test) {

        var thread = new t.Thread('Message text', 'Author name');
        test.equals(thread.getText(), 'Message text');
        test.done();

    },

    testAddChildMessage: function(test){

        var thread = new t.Thread('Message text', 'Author name'),
            threadChild = new t.Thread('response for Message', 'New Author name');

        thread.addChild(threadChild);

        test.equals(thread.getChildCount(), 1);
        test.equals(thread.getChild(0), threadChild);
        test.done();

    },

    testLoop: function(test){

        var thread = new t.Thread('Message text', 'Author name'),
            threadChild = new t.Thread('Message2 text', 'Author name');

        thread.addChild(threadChild);

        for (var i =0; i< thread.getChildCount(); i++){
            test.notEqual(thread, thread.getChild(i));
        }

        test.done();

    },

    testThreadConstructor: function(test){
        var thread = new t.Thread("msg", 'author');
        thread.id = 1;
        var secondThread = new t.Thread("msg", 'author', thread);
        test.equals(thread.parentID, null);
        test.equals(secondThread.parentID, 1);
        test.done();
    },

    testParentsId: function(test){
        var thread = new t.Thread("1", 'author');
        thread.id = 1;
        var secondThread = new t.Thread("2", 'author', thread);
        secondThread.id = 2;
        var firdThread = new t.Thread("3", 'author', secondThread);
        test.equals(firdThread.parents.length, 2);
        test.done();
    }

};