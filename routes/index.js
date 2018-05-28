const router = require('express').Router();
const website = require('./website');
const admin = require('./admin');

function isAuthenticated(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') {
        return next();
    }

    return res.redirect('/forum');
}

router.use('/forum', website);
router.use('/forum/admin', isAuthenticated, admin);

module.exports = router;




//add new comment to a question
app.get('/forum/question/:questionId/comment', (req, res) => {

    if(req.user){
        User
            .findOne({where: {id: req.user.id}})
            .then((user) => {
                Comment
                    .create({
                        content: req.query.content,
                        reviewId: req.params.reviewId,
                        userId: req.user.id
                    })
                    .then(() => res.redirect('/'));
            })
    }
    else{
        res.redirect("/forum/connexion");
    }
});

app.get('/', (req, res) => {
    Review
        .findAll({ include: [Vote, Comment, User] })
        .then((reviews) => {
            res.render('homepage', { reviews, user: req.user });
        });
});


app.get('/forum/createreview', (req, res) => {
    if(req.user){
        res.render('createReview', { user: req.user })
    }

    else{
        res.render('createreview', { user: req.user })
    }
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

app.get('/forum/deconnexion', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/forum/connexion', (req, res) => {
    // Render the login page
    res.render('connexion');
});

app.post('/forum/connexion',
    // Authenticate user when the login form is submitted
    passport.authenticate('local', {
        // If authentication succeeded, redirect to the home page
        successRedirect: '/',
        // If authentication failed, redirect to the login page
        failureRedirect: '/forum/connexion'
    })
);

db
    .sync()
    .then(() =>{
        app.listen(3000, () => {
            console.log('Listening on port 3000');
        });
    });