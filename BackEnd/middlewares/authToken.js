const jwt = require('jsonwebtoken');

function authToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('ابتدا به سامانه وارد شوید.');

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (user.UserLevelId > 3)
      return res.status(401).send('شما فاقد دسترسی به سامانه می باشید.');
    req.user = user;
    next();
  });
}

module.exports = authToken;
