const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
require('dotenv').config();

var Production

if(process.env.Production == "NO"){
  Production = False;
}


if(process.env.Production == "NO"){
  Production = True;
}

//  Session setup
app.use(session({
  secret: process.env.SECRET,
  cookie: {
    maxAge: 600000,
    secure: Production
  },
  saveUninitialized: false,
  resave: false,
  unset: 'destroy'
}));


const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const User = require("./models").User;


const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json({extended: false}))
app.use(express.static(__dirname + "/frontend/vue/dist"));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy({
  usernameField: "Username",
  passwordField: "Password",
},
  function (username, password, done) {
    User.findOne({ where: { Username: username } }).then((user) => {
      if (!user) {
        return done(null, false, { message: 'Username is incorrect' })
      }

      bcrypt.compare(password, user.Password, (err, result) => {
        if (err) {
          console.error(err + " , " + user.Password);
          return done(err);
        }

        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password is incorrect' })
        }
      })
    }).catch((err) => {
      console.error(err);
      return done(err);
    })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


app.post('/api/login',
  passport.authenticate('local', {
    successRedirect: '/',
  })
);

app.post('/api/register', (req, res) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.Password, salt, function (err, hash) {
      User.create({ Username: req.body.Username, Password: hash });
    });
    res.send("successfully registered user " + req.body.Username);
  });
});

app.get('/api/loginTest', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      console.error("ERROR: " + err);
      return next(err);
    }
    if (!req.user) {
      console.error("No User" + user + " "+ info);
      console.log(req.user);
      return res.send('No User')

    }
    return res.send("Logged in");
  })(req, res, next);
});


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})