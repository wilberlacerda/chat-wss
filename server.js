const express = require('express')
const app = express()
app.use(express.static('public'))
const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)
const porta = 8000

http.listen(porta, function(){
    console.log('Servidor iniciado. Abra o navegador em http://localhost:'+porta);
})

app.get('/', function(req, resp){
    resp.sendFile(__dirname + '/index.html')
})

serverSocket.on('connection', function(socket){
    
    socket.on('login', function(nickname) {
        console.log('Cliente conectado: '+ nickname)
        serverSocket.emit('chat-msg', `Usuário ${nickname} conectou.`)
        socket.nickname = nickname
    })

    socket.on('disconnect', function(){
        console.log('Cliente desconectado: ' + socket.nickname)
        serverSocket.emit('chat-msg',  socket.nickname + ' saiu') /*Informa as outros usuarios, que um cliente desconectou*/
    })

    socket.on('chat-msg', function(msg) {
        console.log(`Msg recebida de ${socket.nickname}: ${msg}`);
        serverSocket.emit('chat-msg', `${socket.nickname}: ${msg}`)
    })

    socket.on('status', function(msg) {
        socket.broadcast.emit('status', msg)
    })

})
