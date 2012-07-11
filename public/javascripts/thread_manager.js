$(document).ready(function(){
    var editor = $("#editor");
    var comments = $("#comments");
    $("#send").click(function(){
        $.post(
            "http://localhost:3000/add/",
            editor.serialize(),
            function(data){
                var ul = $(".thread[data-id="+editor.find('input#rootID').val()+"]>ul");
                if (ul.length == 1){
                    ul.append($("<li>",{text: data}));
                } else {
                    console.log(data);
                    comments.append(data);
                }
            }
        );
    });
    comments.on("click", "div.thread .re", function(event){
        var thread = $(this).closest(".thread");
        var hiddenField = editor.find('input#rootID');
        var rootMsgPreview = editor.find('input#preview');
        if (hiddenField.length == 1){
            hiddenField.val(thread.data("id"));
            rootMsgPreview.val(thread.children("b").text());
        } else {
            editor
                .append($("<input>", {id: "rootID", name: "rootID", value: thread.data("id"), type: "hidden"}))
                .prepend($("<input>", {id: "preview", value: thread.children("b").text(), disabled: "disabled"}))
                .prepend($("<label>", {text: "reply to message:"}));
        }
    });
});

