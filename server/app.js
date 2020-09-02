const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const http = require('http');
const path = require('path');
// const engine = require('ejs-locals');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const DB_URI = process.env.MONGODB_URI;
const app = express();

const server = http.createServer(app)

// Websockets
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server }, () => console.log(`Websocket server running on port ${process.env.PORT}`))

// Use new MongoDB Node.js drivers
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.set('useCreateIndex', true);

mongoose.connect(DB_URI, options);


// CORS
const cors = require('cors');
app.use(cors());

// Headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 },
  store: new (require('express-sessions'))({
    storage: 'mongodb',
    instance: mongoose,     // optional
    host: 'localhost',      // optional
    port: 27017,            // optional
    db: 'clarifydb',           // optional
    collection: 'sessions', // optional
  })

}));

app.use(passport.initialize());
app.use(passport.session());

const User = require('./Models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'build')))
// app.get('/*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


// Enable routing and use port.
require('./router')(app);
// app.set('port', 3000);

// Set up ejs templating.
// app.engine('ejs', engine);
// app.set('view engine', 'ejs');

// Set view folder.
// app.set('views', path.join(__dirname, 'Views')); 

app.get('*', function (req, res) {
  res.sendfile('./build/index.html');
});

// That line is to specify a directory where you could 
// link to static files (images, CSS, etc.). 
// So if you put a style.css file in that directory and you 
// could link directly to it in your view <link href=”style.css” rel=”stylesheet”>
app.use(express.static(path.join(__dirname, 'static')));


server.listen(process.env.PORT || 3000, () => {
  console.log(`Express server listening on port ${process.env.PORT}`)
})


wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // console.log('Received from client: ', message)
    wss.clients.forEach((client) => {
      client.send(message)
    })
  })
})