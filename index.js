const express = require('express');
const app = express();
const cors = require('cors');
const handleErrors = require('./middleware/handleError');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});
require('dotenv').config({ path: './config.env' });

//mongodb connection
mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	() => {
		console.log('connected to db');
	}
);

// middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: 'true' }));

//custom router module inclusion
const userRouter = require('./routes/user');
const feedRouter = require('./routes/feed');
const chatRouter = require('./routes/chat');
const connectionRouter = require('./routes/connection');
const chatModel = require('./models/chat/chat');

// route middlewares
app.use('/api/user', userRouter);
app.use('/api/feed', feedRouter);
app.use('/api/chat', chatRouter);
app.use('/api/connection', connectionRouter);

//error handler middleware
app.use(handleErrors);

// static files
app.use(
	'/feed_pictures',
	express.static(path.join(__dirname, 'feed_pictures'))
);
app.use(
	'/profile_pictures',
	express.static(path.join(__dirname, 'profile_pictures'))
);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/build')));

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
	});
}

// socket code
io.on('connection', (socket) => {
	const id = socket.handshake.query.id;
	socket.join(id);
	socket.on('send', (chat) => {
		let chatObj = new chatModel(chat);
		chatObj.save().then(() => {});

		socket.broadcast.to(chat.reciever).emit('recieve', chat);
	});
});

const PORT = process.env.PORT || 8000;
// start the server
server.listen(PORT, () => {
	console.log(`server started in ${PORT} ...`);
});
