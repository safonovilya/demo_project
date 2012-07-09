var Class = require('./../libs/class');

exports.Thread = Class.extend({
    init: function( msgText, author, parentThread) {
        this.msgText = msgText;
        this.author = author;
        if (parentThread){
            var temp = parentThread.id;
            this.parentID = temp;
            this.parents = [];
            this.parents.push(parentThread.id.toString());
            this.parents = this.parents.concat(parentThread.parents);
        } else {
            this.parentID = null;
            this.parents = [];
        }
        this.child = []; // Threads
    },

    addChild: function( child ) {
        this.child[this.child.length] = child;
    },

    getChild: function(index){
        return this.child[index];
    },

    getChildCount: function(){
        return this.child.length;
    },

    getText: function(){
        return this.msgText;
    }
});