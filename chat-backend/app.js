var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var roms = [{ "id": 1, "nome": "Fortaleza" }, { "id": 2, "nome": "São Paulo" }, { "id": 3, "nome": "Rio de Janeio" }, { "id": 4, "nome": "Natal" }, { "id": 5, "nome": "Bahia" }, { "id": 6, "nome": "Belo Horizonte" },{"id":6,"nome":"Florianópolis"}]

var clients = {};
var clientsByRegiao = [];
var clientData = {};

var allowCors = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}

app.use(allowCors);

//implementar depois
app.get('/user/:idRegiao',(r,s)=>{
    var usersJson = {}
    clientsByRegiao.forEach((e)=>{
        if(e.idRegiao == r.params.idRegiao){
            usersJson = e.users; 
        }
    })
    s.json(usersJson);        
    
});

app.get('/chat-rom', (req, res) => {
    if (clientsByRegiao.length == 0) {
        roms.forEach((e)=>{
            clientsByRegiao.push({"idRegiao": e.id,"regiao": e.nome,"users":[]});    
        })
    }
    res.json(roms);
});
app.get('/', function (req, res) {
    res.send('server is running');
});

io.on("connection", function (client) {
    client.on("join", function (json) {
        json.idUser = client.id;
        clients[client.id] = json; //Grava a pessoa no socket

            clientsByRegiao.forEach((e) => {
                if(e.idRegiao == json.idRegiao){
                    e.users.push(json);    
                }
            })
        
        client.emit("update", {"msg": "Você entrou na região " + json.regiao, "user":json});
        client.broadcast.emit("update", {"msg": json.usuario +" acabou de entrar", "user":json});
    });

    client.on("send", function (json) {
        client.broadcast.emit("chat", clients[client.id], json);
    });

    client.on("disconnect", function () {
        if(clients[client.id] != undefined){
            var json = clients[client.id]; //recupera os dados
            client.broadcast.emit("update", {"msg": json.usuario +" saiu da região ", "user":json});
            //remover o usuario da lista
            clientsByRegiao.forEach((e) => {
                if(e.idRegiao == json.idRegiao){
                   e.users.forEach((u,i)=>{
                      if(u.idUser == client.id){
                        e.users.splice(i, 1); 
                      }
                   }) 
                }
            })
            delete clients[client.id];     
        }
    });
});

var server_port = process.env.PORT || 3000;
http.listen(server_port, function () {
    console.log('servidor startado na porta:' + server_port);
});
