var Class = require('./class');

exports.Thread = Class.extend({
    init: function( message ) {
        this.message = message;
        this.child = []; // Threads
    },

    add: function( child ) {
        this.child[this.child.length] = child;
    },

    getChild: function(index){
        return this.child[index];
    }
});

exports.Message = Class.extend({
    init: function(text, authtor) {

        this.msg_text = text;
        this.authtor = authtor;

        this.thread = false;
    },

    getThread: function(){
        return this.thread;
    },

    addResponse: function(msg){

        if (!this.getThread()){
            this.thread = new exports.Thread();
        }

        this.thread.add(msg);
    },

    getText: function(){
        return this.msg_text;
    }

});