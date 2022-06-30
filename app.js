require('dotenv').config();
const { PORT, API_VERSION } = process.env;
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.static(__dirname + '/public'));

//將request進來的 data 轉成 json()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS allow all
app.use(cors({
    origin: true
}));

app.use('/api/' + API_VERSION,  [
    require('./server/routes/user_route'),
    require('./server/routes/match_route'),
    require('./server/routes/chat_route')
]);

app.use(function (err, req, res, next) {
    console.error(err.message);
    res.status(500).send('Internal Server Error');
});

const server = require('http').Server(app).listen(PORT, () => {
    console.log(`Example app listening at port:${PORT}`);
});

const io = require('socket.io')(server,{cors:{
    origin: true
}});

io.on('connection', socket => {
    //經過連線後在 console 中印出訊息
    console.log('success connect! online id: ',socket.id)
    //監聽透過 connection 傳進來的事件
    socket.on('getMessage', message => {
        //回傳 message 給發送訊息的 Client
        socket.emit('getMessage', message)
    })
    //送出中斷申請時先觸發此事件
    socket.on('disConnection', message => {
        const room = Object.keys(socket.rooms).find(room => {
            return room !== socket.id
        })
        //先通知同一 room 的其他 Client
        socket.to(room).emit('leaveRoom', `${message} 已離開聊天！`)
        //再送訊息讓 Client 做 .close()
        socket.emit('disConnection', '')
    })

    //中斷後觸發此監聽
    socket.on('disconnect', () => {
        console.log('disconnect! outline id: ',socket.id)
    })

});

