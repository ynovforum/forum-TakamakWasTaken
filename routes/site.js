const router = require('express').Router();
const passport = require('passport');
const { Question, Comment, User } = require('../models');

const bodyParser = require('body-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res) => {
    Question
        .findAll({ include: [User] })
        .then((articles) => {
            res.render('website/home', { articles, loggedInUser: req.user });
        });
});

router.get('/signin', (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }

    res.render('website/signin');
});

router.post('/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

r

app.get('/forum/inscription', (req, res) => {
    res.render('inscription');
});

app.post('/forum/inscription', (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    const email = req.body.email;
    const password = req.body.password;

    if(name != null && email != null && password != null){

        if(USER.count() > 0){
            User
                .create({
                    name: name,
                    bio: bio,
                    email: email,
                    password: password,
                    role: "RANDOM"
                })
                .then((user) => {
                    req.login(user, () => {
                        res.redirect('/');
                    });
                })
                .catch((error) =>{
                    res.render('500', {error: error})
                });
        }
        else{
            User
                .create({
                    name: name,
                    bio: bio,
                    email: email,
                    password: password,
                    role: "ADMIN"
                })
                .then((user) => {
                    req.login(user, () => {
                        res.redirect('/admin');
                    });
                })
                .catch((error) =>{
                    res.render('500', {error: error})
                });
        }
    }
    else{
        console.log("L'utilisateur n'a pas pu être créé.")
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/articles/:articleId', (req, res) => {
    Question
        .findById(req.params.articleId, {
            include: [
                User,
                {
                    model: Comment,
                    include: [User]
                }
            ]
        })
        .then((article) => {
            res.render('website/article', { article, loggedInUser: req.user });
        });
});

router.post('/articles/:articleId', (req, res) => {
    const { content } = req.body;
    Comment
        .create({
            content,
            userId: req.user.id,
            articleId: req.params.articleId
        })
        .then(() => {
            res.redirect(`/articles/${req.params.articleId}`);
        });
});

router.get('/profile/:userId', (req, res) => {
    User
        .findById(req.params.userId, { include: [Question] })
        .then((user) => {
            res.render('website/profile', { user, loggedInUser: req.user });
        });
});

module.exports = router;
