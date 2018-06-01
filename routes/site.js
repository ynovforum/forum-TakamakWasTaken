const router = require('express').Router();
const passport = require('passport');
const { Question, Comment, User } = require('../models');

function prettyDate(question){

    let date = new Date(question.createdAt);
    question["prettyDate"] = date.getDate() + "/" + parseInt(date.getMonth()+1) + "/" + date.getFullYear();
    return question;
}

router.get('/', (req, res) => {
    Question
        .findAll({ include: [User] })
        .then((questions) => {
            for(let y=0; y<questions.length; y++){
                questions[y] = prettyDate(questions[y]);
            }
            res.render('site/home', { questions, loggedInUser: req.user });
        });
});

router.get('/deconnexion', function(req, res){
    req.logout();
    res.redirect('/forum');
});

router.get('/connexion', (req, res) => {
    // Render the login page
    res.render('site/connexion');
});

router.post('/connexion',
    // Authenticate user when the login form is submitted
    passport.authenticate('local', {
        // If authentication succeeded, redirect to the home page
        successRedirect: '/forum',
        // If authentication failed, redirect to the login page
        failureRedirect: '/forum/connexion'
    })
);

router.get('/inscription', (req, res) => {
    res.render('site/inscription');
});

router.post('/inscription', (req, res) => {
    const name = req.body.name;
    const bio = req.body.bio;
    const email = req.body.email;
    const password = req.body.password;

    if(name != null && email != null && password != null){
        User
            .count()
            .then((count) => {
                if(count > 0) {
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
                                res.redirect('/forum');
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
                                res.redirect('/forum');
                            });
                        })
                        .catch((error) =>{
                            res.render('/site/error/500', {error: error})
                        });
                }
            });
    }
    else{
        console.log("L'utilisateur n'a pas pu être créé.")
    }
});

router.get('/question/details/:questionId', (req, res) => {
    if(req.user){
        Question
            .findById(req.params.questionId, {
                include: [
                    User,
                    {
                        model: Comment,
                        include: [User]
                    }
                ]
            })
            .then((question) => {
                res.render('site/questions/question', { question, loggedInUser: req.user });
            });
    }
    else{
        res.redirect('/forum/connexion');
    }
});

router.post('/question/details/:questionId', (req, res) => {
    const { content } = req.body;
    Comment
        .create({
            content,
            userId: req.user.id,
            questionId: req.params.questionId
        })
        .then(() => {
            res.redirect("/forum/question/details/" + req.params.questionId);
        });
});

router.get('/profile/:userId', (req, res) => {
    User
        .findById(req.params.userId, { include: [Question] })
        .then((user) => {
            res.render('site/profile', { user, loggedInUser: req.user });
        });
});

router.get('/question/creer', (req, res) => {
    res.render('site/questions/newQuestion', { loggedInUser: req.user });
});

router.post('/question/creer', (req, res) => {
    if(req.user){
        const { title, description } = req.body;
        Question
            .create({
                title,
                description,
                userId: req.user.id
            })
            .then(() => {
                res.redirect('/forum');
            })
            .catch((error) =>{
                res.render('/site/error/500', {error: error})
            });
    }
    else{
        res.redirect('/forum/connexion')
    }
});


router.get('/question/edit/:questionId', (req, res) => {
    if(req.user){
        Question
            .findById(req.params.questionId)
            .then((question) => {
                res.render('site/questions/editQuestion', { question, loggedInUser: req.user });
            });
    }
    else{
        res.redirect("/forum");
    }
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
                setTimeout(function(){res.redirect("/forum/question/details/" + req.params.questionId);},1000);
            })
            .catch((error) =>{
                res.render('/site/error/500', {error: error})
            });
    }
    else{
        res.redirect('/forum/connexion')
    }
});



router.get('/question/:questionId/comment/edit/:commentId', (req, res) => {
    if(req.user){
        Comment
            .findById(req.params.commentId)
            .then((comment) => {
                res.render('site/questions/editComment', { comment, loggedInUser: req.user });
            });
    }
    else{
        res.redirect("/forum");
    }
});

router.post('/question/:questionId/comment/edit/:commentId', (req, res) => {
    if(req.user){
        const { content } = req.body;
        Comment
            .findById(req.params.commentId)
            .then((comment) => {
                comment.updateAttributes({
                    content
                })
                    .then(() => {
                        res.redirect("/forum/question/details/" + req.params.questionId);
                    });
            })
            .catch((error) =>{
                res.render('/site/error/500', {error: error})
            });
    }
    else{
        res.redirect('/forum/connexion')
    }
});

router.get('/question/resolve/:questionId', (req, res) => {
    now = new Date();
    Question
        .findById(req.params.questionId)
        .then((question) => {
            question.updateAttributes({ resolvedAt: new Date(now.getTime() + 2*60*60*1000) })
                .then(() => {
                    res.redirect('/forum/question/details/' + req.params.questionId);
                });
        })
});

module.exports = router;
