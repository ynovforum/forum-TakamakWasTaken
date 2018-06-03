const router = require('express').Router();
const { User, Question, Comment } = require('../models');
const prettyDate = require('./prettyDate');


router.get('/users', (req, res) => {
    User
        .findAll()
        .then((users) => {
            for(let i=0; i< users.length; i++){
                users[i] = prettyDate(users[i]);
            }
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

    Comment
        .destroy({ where: { questionId: req.params.questionId } })
        .then(() =>{
            Question
                .destroy({ where: { id: req.params.questionId } })
                .then(() => {
                    res.redirect("/forum");
                })
        });


});

router.get('/question/:questionId/comment/delete/:commentId', (req, res) => {
    Comment
        .destroy({where: {id: req.params.commentId }})
        .then(() => {
            res.redirect("/forum/question/details/" + req.params.questionId);
        })
});

module.exports = router;
