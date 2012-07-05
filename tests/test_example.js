var mt = require('./../message-thread');

exports.StructureTest = {

    check_msg: function(test) {

        var msg = new mt.Message('Message text', 'Author name'),
            thread = new mt.Thread(msg);

        test.equals(thread.message.getText(), 'Message text');
        test.done();

    },

    get_child: function(test){

        var msg = new mt.Message('Message text', 'Author name'),
            thread = new mt.Thread(msg),
            child_thread = new mt.Thread(new mt.Message('response for Message', 'New Author name'));

        thread.add(child_thread);

        test.equals(thread.getChild(0), child_thread);
        test.done();

    },

    test3: function(test){

        var thread = new mt.Thread(new mt.Message('Message text','Author name'));

        var msg = new mt.Message('Message2 test','Author name');
        thread.add(new mt.Thread(msg));
        thread.add(new mt.Thread(new mt.Message('Message3 test','Author name')));

        for (var index in thread.){

        }

        test.equals(thread.getChild(index).message.getText(), msg.getText());
        test.done();

    }

};