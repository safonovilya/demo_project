var Class = require('./../libs/class');

exports.Thread = Class.extend({
    init: function( msgText, author, parentThread) {
        this.msgText = msgText;
        this.author = author;

        if (parentThread){
            this._setParentID(parentThread.id);
            this._setParents(parentThread.parents);
        } else {
            this.parentID = null;
            this.parents = [];
        }
        this.child = []; // Threads
    },

    setFromDoc: function(doc){
        this.msgText = doc.msgText;
        this.author = doc.author;
        this.parentID = doc.parentID;
        this.parents = doc.parents;
        this.id = doc._id;
    },

    _setParentID: function(id) {
        this.parentID = id;
    },

    _setParents: function(arrayParentsID){
        this.parents = arrayParentsID;
        if (this.parentID)
            this.parents.push(this.parentID);
    },

    addChild: function( child ) {
        this.child.push(child);
    },

    getChild: function(index){
        return this.child[index];
    },

    getChildCount: function(){
        return this.child.length;
    },

    getText: function(){
        return this.msgText;
    },

    getDoc: function(){
        return {
            msgText: this.msgText,
            author: this.author,
            parentID: this.parentID,
            parents: this.parents
        };
    },

    getModel: function(){
        return {
            msgText: this.msgText,
            author: this.author,
            id: this.id,
            childCount: this.getChildCount(),
            child: this.child
        };
    }

});