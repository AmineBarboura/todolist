var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var todolist=[];

app.get("/todo",function(req,res){
    res.render("todo.ejs",{todolist: todolist});
})
/* On redirige vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next){
    res.redirect('/todo');
});
io.sockets.on('connection', function (socket, pseudo) {
    console.log('Un client est connecté bbba !');

    socket.on('addtodo', function (todo) {
        todolist.push(todo);
        socket.broadcast.emit("update",todolist);
        socket.emit("update",todolist);
    });
    socket.on('deletetodo', function (index) {
        todolist.splice(index,1);
        socket.broadcast.emit("update",todolist);
        socket.emit("update",todolist);
    });
});

server.listen(8080);