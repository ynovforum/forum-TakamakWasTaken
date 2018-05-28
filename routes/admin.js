const router = require('express').Router();
const { Question } = require('../models');

router.get('/articles/new', (req, res) => {
    res.render('admin/articles/new', { loggedInUser: req.user });
});

router.post('/articles/new', (req, res) => {
    const { title, content } = req.body;
    Article
        .create({ title, content, userId: req.user.id })
        .then(() => {
            res.redirect('/');
        });
});

router.get('/articles/:articleId', (req, res) => {
    Article
        .findById(req.params.articleId)
        .then((article) => {
            res.render('admin/articles/article', { article, loggedInUser: req.user });
        });
});

router.post('/articles/:articleId', (req, res) => {
    const { title, content } = req.body;
    Article
        .update({ title, content }, { where: { id: req.params.articleId } })
        .then(() => {
            res.redirect(`/articles/${req.params.articleId}`);
        });
});

module.exports = router;
