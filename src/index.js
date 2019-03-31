'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const usersRoute = require('./routes/routes');
const app = express();

const sess = {
  secret: 'secrete key',
  cookie:{}
}
//for production use true for secure cookies
//set false when is on devn enviroment

if(app.get('env') == 'production'){
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}
//useing express for use authentication
app.use(session(sess));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

//connecting to mongo database | default port:27017
mongoose.connect("mongodb://localhost:27017/course-api",  { useNewUrlParser: true });
const db = mongoose.connection;
// set our port
app.set('port', process.env.PORT || 5000);
// morgan gives us http request logging
app.use(morgan('dev'));

//Mongod connection error handling
db.on('error', (error) => {
  console.error("Something whent wrong", error);
});
//database succeful connection
db.once('open', () => {
  console.log("      DB Connection Succeful        ");
});

// TODO add additional routes here
app.use('/api', usersRoute);
// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});

// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports =app;
