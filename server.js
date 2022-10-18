const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// .env 환경변수 사용하기
require('dotenv').config();

// express & 포트 만들기
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json({limit:'50mb'})); // 파일 업로드 용량
app.use(express.urlencoded({limit:'50mb', extended:false}));

// mongoDB
const uri = `${process.env.ATLAS_URI}`;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log(`MongoDB database connection established successfully`);
})

// router
const usersRouter = require('./routes/users');
const forumsRouter = require('./routes/forums');
const commentsRouter = require('./routes/comments');
const heartRouter = require('./routes/hearts');
app.use('/api/user', usersRouter);
app.use('/api/forum', forumsRouter);
app.use('/api/comment', commentsRouter);
app.use('/api/heart', heartRouter);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('/api/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// 서버 시작
const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
/*
const SocketIO = require('socket.io');

// 서버 연결, path는 프론트와 일치시켜준다.
const io = SocketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods:["GET","POST"],
    }
});
*/
/* Create socket io connection 기존 삭제 */
const io = require("./utils/socket").init(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods:["GET","POST"],
    }
})

io.on("connection", socket => {
    console.log("Client connected");

     //* 연결 종료 시
    socket.on('disconnect', () => {
        console.log('클라이언트 접속 해제', socket.id);
        clearInterval(socket.interval);
    });

    //* 에러 시
    socket.on('error', (error) => {
        console.error(error);
    });

    //* 클라이언트로부터 메시지 수신
    socket.on('reply', (data) => { // reply라는 이벤트로 송신오면 메세지가 data인수에 담김
        console.log(data);
    });

    //socket.emit('comment', 'comment')
})
