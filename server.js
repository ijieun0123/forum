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
app.use(express.json()); // json 파싱

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
app.use('/user/', usersRouter);
app.use('/forum/', forumsRouter);
app.use('/comment/', commentsRouter);
app.use('/heart/', heartRouter);

// Server static assets if in production
if(process.env.NODE_ENV === 'production'){
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static('client/build'));

  // index.html for all page routes
  app.get('/', (req, res) => {
      res.sendFile(path.resolve(_dirname, './client', 'build', 'index.html'));
  })
}


// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
