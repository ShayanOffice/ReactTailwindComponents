const router = require('express').Router();

router.use('/monitors', require('./LOVs/LOVMonitors'));

module.exports = router;
