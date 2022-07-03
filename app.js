require('dotenv').config();
const { PORT, API_VERSION } = process.env;
const express = require("express");
const app = express();
const cors = require("cors");

app.use("/api",express.static(__dirname + '/public'));

//將request進來的 data 轉成 json()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS allow all
app.use(cors({
	origin: true
}));

app.use('/api/' + API_VERSION,	[
	require('./server/routes/user_route'),
	require('./server/routes/match_route'),
	require('./server/routes/chat_route')
]);

app.use(function (err, req, res, next) {
	console.error(err.message);
	res.status(500).send('Internal Server Error');
});

const httpServer = require('http').Server(app).listen(PORT, () => {
	console.log(`Example app listening at port:${PORT}`);
});


//socket.io below


const io = require('socket.io')(httpServer,{cors:{
	origin: true
}});

let users = [];

const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
	users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return users.find((user) => user.userId === userId);
};

io.on('connection', socket => {
	//經過連線後在 console 中印出訊息
	console.log('success connect! online id: ',socket.id)
	//take userID and socketID form user
	socket.on("addUser",userId=>{
		addUser(userId, socket.id);
		io.emit("getUsers", users);
	})
	//監聽透過 connection 傳進來的事件
	socket.on("sendMessage", ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
		io.to(user.socketId).emit("getMessage", {
			senderId,
			receiverId,
			text,
		});
	});
	//中斷後觸發此監聽
	socket.on("disconnect", () => {
		console.log("a user disconnected!");
		removeUser(socket.id);
		io.emit("getUsers", users);
	});
});

