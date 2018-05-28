const router = require('express').Router();
const { User, Question } = require('../models');


router.get('/users', (req, res) => {
    User
        .findAll()
        .then((users) => {
            res.render('admin/users/users', { users, loggedInUser: req.user });
        });
});

router.get('/users/edit/:userId', (req, res) => {
    User
        .findById(req.params.userId)
        .then((user) => {
            res.render('admin/users/edit/:userId', { user, loggedInUser: req.user });
        });
});

router.post('/user/edit/:userId', (req, res) => {
   const role = req.body.role.valueOf();
});

router.get('/forum/admin/question/delete/:questionId', (req, res) => {
    if(req.user.role === "ADMIN"){
        Question
            .findById(req.params.questionId)
            .delete(question)
            .then(() => {
                res.redirect('/forum');
            })
    }
});

module.exports = router;
