var Class = require('./../libs/class');

exports.Thread = Class.extend({
    init: function( msgText, author, parentID ) {
        this.msgText = msgText;
        this.author = author;
        this.parentID = parentID;
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