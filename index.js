
// IMPORTS ===================================================================================

const express = require('express')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

const { Op } = require("sequelize");

const passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const User = require("./models").User;
const Message = require("./models").Message;

const bcrypt = require('bcrypt');
const saltRounds = 10;

//SETUP =======================================================================================

require('dotenv').config();

var Production

if (process.env.Production == "NO") {
  Production = False;
}


if (process.env.Production == "NO") {
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

app.use(bodyParser.json())
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

function isAuthenticated(req, res, next) {
  if (req.user)
    return next();
  else
    return res.status(401).json({
      error: 'User not authenticated'
    })

}


// ROUTES ======================================================================================

app.post('/api/login',
  passport.authenticate('local'),
  function (req, res) {
    res.send("Logged in: " + req.user.Username)
  }
);

app.post('/api/purge',
  async (req, res) => {

    Users = await User.findAll();
    Messages = await Message.findAll()
    res.send({
      Users: Users,
      Messages: Messages
    });

  }
);

app.post('/api/query',
  async (req, res) => {

    const People = await User.findAll({
      attributes: ['Username', 'id'],
      where: {
        Username: { [Op.like]: '%' + req.body.Query + '%' }
      }
    })

    res.send(People)
  }
);

app.post('/api/SendMessage',
  isAuthenticated,
  function (req, res) {
    Message.create({ Message: req.body.Message, Receiver: req.body.Receiver, Sender: req.user.Username });
    res.send("Message sent: " + req.body.Message);
  });

app.post('/api/GetMessages',
  isAuthenticated,
  async (req, res) => {
    let messages = await Message.findAll({
      where: {
        [Op.or]: [
          { Sender: req.body.Username, Receiver: req.user.Username },
          { Receiver: req.body.Username, Sender: req.user.Username }
        ]
      }
    });
    res.send(messages)
  });


app.post('/api/CheckUser', async (req, res) => {
  user = await User.findOne({ where: { Username: req.body.Username } });
  if (user) {
    res.send('Taken')
  } else {
    res.send('Free');
  }
}
);

app.post('/api/register', async (req, res) => {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) {
      res.send(err);
    }
    bcrypt.hash(req.body.Password, salt, function (err, hash) {
      if (err) {
        res.send(err);
      }
      User.create({ Username: req.body.Username, Password: hash })
        .then((user) => {
          req.login(user, function (err) {
            if (err) { return next(err); }
            return res.send("successfully registered user " + req.body.Username);
          });
        })
        .catch((err) => { res.send(err) })
    });
  });
});

app.get('/api/loginTest', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error("ERROR: " + err);
      return next(err);
    }
    if (!req.user) {
      console.error("No User" + req.user + " " + info);
      console.log(req.user);
      return res.send('No User')

    }
    return res.send("Logged in " + req.user.Username);
  })(req, res, next);
});



app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})