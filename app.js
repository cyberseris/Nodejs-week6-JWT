var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const dotenv = require('dotenv');
var app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', err => {
  console.error('Uncaughted Exception!');
  console.error(err);
  process.exit(1);
})

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('資料庫連接成功'));
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  })
}

//Production 環境錯誤
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message
    });
  } else {
    //log 紀錄
    console.error('出現重大錯誤', err);
    //預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請洽系統管理員'
    });
  }
}

//express 錯誤處理， 全域捕捉，Express 的錯誤處理中間件
app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  //dev
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }

  //production
  if (err.name === 'ValidationError') {
    err.message = "資料欄位未填寫正確，請重新輸入"
    err.isOperational = true;
    return resErrorProd(err, res);
  }

  return resErrorProd(err, res);
})

process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection: ', promise, '原因：', err);
});

module.exports = app;
