var mt = require('./message-thread');

exports.SimpleTest = {

    test1: function(test) {
        var thread = new mt.Thread(),
            msg = new mt.Message('Message text', 'Author name');

        msg.addResponse(new mt.Message('response for Message', 'New Author name'));

        thread.add(msg);

        test.equals(thread.getItems().length, 1, "Thread has 1 message");

        var items = thread.getItems();

        for (var i in items){
            test.notEqual(items[i].getSubThread(), false);

        }

        test.done();

    }

};