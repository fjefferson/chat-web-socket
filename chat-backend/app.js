var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = {};
var clientData = {};

app.get('/', function(req, res){
  res.send('server is running');
});

io.on("connection", function (client) {
    client.on("join", function(json){
        clientData = JSON.parse(json);
    	clients[client.id] = clientData.name;
        client.emit("update",{"nome":clientData.name,"msg":"Você entrou na sala("+ clientData.room +")", "room":clientData.room , "roomId": clientData.roomId});
        clientData.msg= clientData.name + " entrou no sala "+ clientData.room +"!";
        client.broadcast.emit("update", clientData);
        //console.log(Object.keys(clients).length);
    });

    client.on("send", function(msg){
        clientSendMsg = JSON.parse(msg);
        clientSendMsg.nome = clientData.name;
        clientSendMsg.roomId = clientData.roomId;
    	console.log("Message: " + clientSendMsg);
        client.broadcast.emit("chat", clients[client.id], clientSendMsg);
    });

    client.on("disconnect", function(){
    	console.log("Disconnect");
        var json = '{"msg": "'+ clientData.name + ' saiu da sala","room": "' + clientData.room +'","room": "' + clientData.room +'","roomId": "' + clientData.roomId +'"}';
        io.emit("update",JSON.parse(json));
        delete clients[client.id];
    });
});

var server_port = process.env.PORT || 80;
http.listen(server_port, function() {
  console.log('servidor startado na porta:' + server_port);
});
