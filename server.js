const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const _dirname = path.resolve();

// .env 환경변수 사용하기
require('dotenv').config();

// express & 포트 만들기
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json({limit: '50mb'})); // 파일 업로드 용량
app.use(express.urlencoded({limit: '50mb', extended:false}));

// mongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log(`MongoDB database connection established successfully`);
})

// router
const usersRouter = require('./routes/users');
const forumsRouter = require('./routes/forums');
const commentsRouter = require('./routes/comments');
const heartRouter = require('./routes/heart');
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
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
