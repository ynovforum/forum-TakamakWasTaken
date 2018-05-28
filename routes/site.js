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
            res.render('site/home', { articles, loggedInUser: req.user });
        });
});

app.get('/deconnexion', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/connexion', (req, res) => {
    // Render the login page
    res.render('site/connexion');
});

app.post('/connexion',
    // Authenticate user when the login form is submitted
    passport.authenticate('local', {
        // If authentication succeeded, redirect to the home page
        successRedirect: '/',
        // If authentication failed, redirect to the login page
        failureRedirect: '/connexion'
    })
);

app.get('/inscription', (req, res) => {
    res.render('site/inscription');
});

app.post('/inscription', (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    const email = req.body.email;
    const password = req.body.password;

    if(name != null && email != null && password != null){

        if(User.count() > 0){
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
                    res.render('/site/500', {error: error})
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
                    res.render('/site/500', {error: error})
                });
        }
    }
    else{
        console.log("L'utilisateur n'a pas pu être créé.")
    }
});

router.get('/question/:questionId', (req, res) => {
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
            res.render('site/questions/question', { article, loggedInUser: req.user });
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

router.get('forum/profile/:userId', (req, res) => {
    User
        .findById(req.params.userId, { include: [Question] })
        .then((user) => {
            res.render('website/profile', { user, loggedInUser: req.user });
        });
});

app.post('/forum/createreview', (req, res) => {
    if(req.user){
        const game = req.body.game;
        const note = req.body.note;
        const content = req.body.content;
        const user = req.user;
        Question
            .create({
                game: game,
                note: note,
                content: content,
                userId: user.id
            })
            .then(() => {
                res.redirect('/');
            })
            .catch((error) =>{
                res.render('500', {error: error})
            });
    }
    else{
        res.redirect('/forum/connexion')
    }
});

module.exports = router;
