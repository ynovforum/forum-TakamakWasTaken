const router = require('express').Router();
const { User } = require('../models');


router.get('/users', (req, res) => {
    User
        .findAll()
        .then((users) => {
            res.render('admin/articles/article', { users, currentUser: req.user });
        });
});

router.get('/users/edit/:userId', (req, res) => {
    User
        .findById(req.params.userId)
        .then((user) => {
            res.render('admin/articles/article', { user, currentUser: req.user });
        });
});

module.exports = router;
