function userLevelCheck(biggestAccessLevelId = 999) {
  return (req, res, next) => {
    // console.warn(req.user.UserLevelId, biggestAccessLevelId);
    if (req.user.UserLevelId > biggestAccessLevelId) {
      return res
        .status(401)
        .send('کاربر وارد شده فاقد دسترسی به این بخش از سامانه می باشد.');
    }
    next();
  };
}

module.exports = userLevelCheck;
