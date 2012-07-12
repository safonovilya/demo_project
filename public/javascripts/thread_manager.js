$(document).ready(function(){
    var editor = $("#editor");
    var comments = $("#comments");
    $("#send").click(function(){
        if (comments.find(".thread").length > 0 && editor.find('input#rootID').length == 0){
            alert("enter the thread!");
            return false;
        }
        $.post(
            "http://localhost:90/add/",
            editor.serialize(),
            function(data){
                var ul = $(".thread[data-id="+editor.find('input#rootID').val()+"]>ul");
                if (ul.length == 1){
                    ul.append($("<li>",{html: data}));
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

