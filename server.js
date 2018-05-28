const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { database, User } = require('./models');
const routes = require('./routes');

passport.use(new LocalStrategy((email, password, cb) => {

    // Find a user with the provided username (which is an email address in our case)
    User
        .findOne({
            where: {
                email, password
            }
        })
        .then(user => {
            if(user){
                return cb(null, user);
            }
            else{
                return cb(null, false, {
                    message: `No user account found for "${email}"`
                });
            }
        });
}));

// Save the user's email address in the cookie
passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    // Fetch the user record corresponding to the provided email address
    User
        .findById(id)
        .then((user) => {
            cb(null, user);
        })
        .catch(cb);
});

const COOKIE_SECRET = 'cookie secrAIENT';
const app = express();

app.set('view engine', 'pug');
app.use(cookieParser(COOKIE_SECRET));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: COOKIE_SECRET, resave: false, saveUninitialized: false }));
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

database.sync().then(() => {
    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
});