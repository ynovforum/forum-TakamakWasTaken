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
            res.render('admin/users/editUser', { user, loggedInUser: req.user });
        });
});

router.post('/users/edit/:userId', (req, res) => {
   const role = req.body.role;
   User
       .findById(req.params.userId)
       .then((user) => {
            user.updateAttributes({ role });
            setTimeout(function(){res.redirect("/forum/admin/users");},1000);

       });
});

router.get('/question/delete/:questionId', (req, res) => {
    Question
        .findById(req.params.questionId)
        .delete(question)
        .then(() => {
            res.redirect('/forum');
        })
});

router.get('question/:questionId/comment/delete/:commentId', (req, res) => {
   Comment
       .findById(req.params.commentId)
       .delete(question)
       .then(() => {
            res.redirect('/forum/question/' + req.params.questionId);
       })
});

module.exports = router;
