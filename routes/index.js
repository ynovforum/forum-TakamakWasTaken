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


db
    .sync()
    .then(() =>{
        app.listen(3000, () => {
            console.log('Listening on port 3000');
        });
    });