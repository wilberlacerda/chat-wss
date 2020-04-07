const express = require('express')
const app = express()

app.use(express.static("public"))

const http = require('http').Server(app)
const serverSocket = require('socket.io')(http)

const porta = process.env.PORT || 8000

const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

http.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host)
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr)
})

app.get('/', function (requisicao, resposta) {
    resposta.sendFile(__dirname + '/index.html')
})


serverSocket.on('connection', function(socket){
    
    socket.on('login', function(nickname) {
        console.log('Cliente conectado: '+ nickname)
        serverSocket.emit('chat-msg', `Usuário ${nickname} conectou.`)
        socket.nickname = nickname
    })

    socket.on('disconnect', function(){
        console.log('Cliente desconectado: ' + socket.nickname)
        serverSocket.emit('chat-msg',  socket.nickname + ' saiu') 
    })

    socket.on('chat-msg', function(msg) {
        console.log(`Msg recebida de ${socket.nickname}: ${msg}`);
        serverSocket.emit('chat-msg', `${socket.nickname}: ${msg}`)
    })

    socket.on('status', function(msg) {
        socket.broadcast.emit('status', msg)
    })

})
