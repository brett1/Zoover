var path = require('path');
var fs = require('fs');
var express = require('express');

// Server part
var app = express();
app.use('/', express.static(path.join(__dirname, 'public')));

var server = app.listen(5000);
console.log('Server listening on port 5000');

// Socket.IO part
var io = require('socket.io')(server);

var sendComments = function (socket) {
    fs.readFile('_comments.json', 'utf8', function(err, comments) {
        comments = JSON.parse(comments);
        socket.emit('comments', comments);
    });
};
var passport = require('passport');


var strategy = require('./setup-passport');

// Session and cookies middlewares to keep user logged in
var cookieParser = require('cookie-parser');
var session = require('express-session');


app.use(cookieParser());
// See express session docs for information on the options: https://github.com/expressjs/session
app.use(session({ secret: 'keyboard cat', resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Auth0 callback handler
app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/index.html' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/activity.html");
  });

io.on('connection', function (socket) {
    console.log('New visitor detected!');

    socket.on('fetchComments', function () {
        sendComments(socket);
    });

    socket.on('newComment', function (comment, callback) {
        fs.readFile('_comments.json', 'utf8', function(err, comments) {
            comments = JSON.parse(comments);
            comments.push(comment);
            fs.writeFile('_comments.json', JSON.stringify(comments, null, 4), function (err) {
                io.emit('comments', comments);
                callback(err);
            });
        });
    });
});