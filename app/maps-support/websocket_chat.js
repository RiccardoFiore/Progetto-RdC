//WEBSOCKET
var url = "ws://localhost:8087/";
var socket;


function connectToChat() {
    socket = new WebSocket(url);
    socket.onmessage = function (msg) {
        var chatBox = document.getElementById("chatBox");
        var message = JSON.parse(msg.data);
        chatBox.innerHTML =  chatBox.innerHTML + "<br><b class='msg_user'>" + message.user + "</b>: " + message.text;
    };
    socket.onopen = function () {
        var message = {};
        message.user = user;
        message.text = "<b>Joined the chat</b>";
        socket.send(JSON.stringify(message));
    };

    socket.onclose= function () {
        var message = {};
        message.user = user;
        message.text = "<b>Abbandono la chat</b>";
        socket.send(JSON.stringify(message));
    };
    document.getElementById("chat").setAttribute("style", "");
    //document.getElementById("welcome").setAttribute("style", "display:none");
    document.getElementById("join").setAttribute("style", "display:none");
}
function sendMessage() {
    var message = {};
    message.user = user;
    message.text = document.getElementById("message").value;
    if (message.text !== "") socket.send(JSON.stringify(message));
    else return;
    document.getElementById("message").value = "";
}
window.onload = function () {
    document.getElementById("chat").setAttribute("style", "display:none");
};


