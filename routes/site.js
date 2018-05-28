const router = require('express').Router();
const passport = require('passport');
const { Question, Comment, User } = require('../models');

router.get('/', (req, res) => {
    Question
        .findAll({ include: [User] })
        .then((questions) => {
            res.render('site/home', { questions, loggedInUser: req.user });
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
                    res.render('/site/error/500', {error: error})
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
                        res.redirect('/');
                    });
                })
                .catch((error) =>{
                    res.render('/site/error/500', {error: error})
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

router.post('/questions/:questionId', (req, res) => {
    const { content } = req.body;
    Comment
        .create({
            content,
            userId: req.user.id,
            questionId: req.params.questionId
        })
        .then(() => {
            res.redirect(`/articles/${req.params.questionId}`);
        });
});

router.get('forum/profile/:userId', (req, res) => {
    User
        .findById(req.params.userId, { include: [Question] })
        .then((user) => {
            res.render('website/profile', { user, loggedInUser: req.user });
        });
});

router.get('/question/creer', (req, res) => {
    res.render('website/questions/newQuestion', { loggedInUser: req.user });
});

router.post('/question/creer', (req, res) => {
    if(req.user){
        const { title, description } = req.body;
        Question
            .create({
                title,
                description,
                userId: user.id
            })
            .then(() => {
                res.redirect('/');
            })
            .catch((error) =>{
                res.render('/site/error/500', {error: error})
            });
    }
    else{
        res.redirect('/connexion')
    }
});


router.get('/question/edit/:questionId', (req, res) => {
    res.render('website/questions/editQuestion', { loggedInUser: req.user });
});

router.post('/question/edit/:questionId', (req, res) => {
    if(req.user){
        const { title, description } = req.body;
        Question
            .findById(req.params.questionId)
            .then((question) => {
                question.updateAttributes({
                    title,
                    description
                });
                res.redirect('/');
            })
            .catch((error) =>{
                res.render('/site/error/500', {error: error})
            });
    }
    else{
        res.redirect('/connexion')
    }
});

module.exports = router;
