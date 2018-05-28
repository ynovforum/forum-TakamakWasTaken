const router = require('express').Router();
const website = require('./site');
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
router.get('/forum/question/:questionId/comment', (req, res) => {

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


router.get('/forum/createreview', (req, res) => {
    if(req.user){
        res.render('createReview', { user: req.user })
    }

    else{
        res.render('createreview', { user: req.user })
    }
});