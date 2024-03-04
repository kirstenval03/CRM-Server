var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var clientRouter = require('./routes/client');
var eventRouter = require('./routes/event');

var contactRouter = require('./routes/contact'); 
var linkRouter = require('./routes/links');

var boardRouter = require('./routes/Board/boards');
var columnRouter = require('./routes/Board/columns');
var taskRouter = require('./routes/Board/tasks');


var modulesRouter = require('./routes/modules'); 
var lessonRouter = require('./routes/lesson');

// Import the progress router
var progressRouter = require('./routes/progress');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(
  cors({
    origin: [process.env.REACT_APP_URI] // <== URL of your React app
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/event', eventRouter);
app.use('/client', clientRouter);
app.use('/contact', contactRouter); 
app.use('/link', linkRouter);

app.use('/board', boardRouter);
app.use('/column', columnRouter);
app.use('/task', taskRouter);

app.use('/modules', modulesRouter );
app.use('/lesson', lessonRouter);

// Use the progress router for progress-related routes
app.use('/progress', progressRouter);



mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

module.exports = app;

