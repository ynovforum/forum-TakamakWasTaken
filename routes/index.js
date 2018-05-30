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

router.get('/', (req, res) => {
   res.redirect('/forum');
});

module.exports = router;


