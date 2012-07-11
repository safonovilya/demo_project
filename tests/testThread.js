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
        console.log('testThreadConstructor');
        var thread = new t.Thread("msg", 'author', null),
            secondThread = new t.Thread("msg", 'author', 1);
        test.equals(thread.parentID, null);
        test.equals(secondThread.parentID, 1);
        test.done();
    }
};