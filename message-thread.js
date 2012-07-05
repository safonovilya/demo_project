var Class = require('./class');

exports.Thread = Class.extend({
    init: function() {
        this.messages = [];
    },

    add: function( m ) {
        this.messages[this.messages.length] = (m);
    },

    getItems: function() {
        return this.messages;
    }
});

exports.Message = Class.extend({
    init: function() {
        this.subThread = false;
    },

    getSubThread: function(){
        return this.subThread;
    },

    addResponse: function(msg){

        if (!this.getSubThread()){
            this.subThread = new exports.Thread();
        }

        this.subThread.add(msg);
    }

});