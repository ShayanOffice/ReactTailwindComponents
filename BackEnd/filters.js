const _ = require('lodash');
const authToken = require('./middlewares/authToken');
const router = require('express').Router();
// هر کار با فرض کار بر روی فقط یک فرم، فقط یک ترکیب فیلتر میزند
// ساختار filters => {[User1]: { Identity: 'Modelx', Params: { paramA: 'valA' , paramB: 'ValB', ... },
//                    [User2]: { Identity: 'Modely', Params: { paramM: 'valM' , ... },
//                    [User3]: {...},
//                    ...,
//                     }
const filters = {};

function generateWhereClause(userId) {
  var whereClause = {};
  if (filters[userId]?.Params) {
    const obj = {};
    for (let i = 0; i < Object.keys(filters[userId].Params).length; i++) {
      const key = Object.keys(filters[userId].Params)[i];
      if (filters[userId].Params[key] != '') {
        if (typeof filters[userId]?.Params[key] != 'object') {
          _.set(obj, key, { contains: filters[userId].Params[key] });
        } else {
          obj[key] = filters[userId].Params[key];
        }
      }
    }

    whereClause = obj;
  }
  return whereClause;
}

router.get('/', authToken, async (req, res) => {
  try {
    filters[req.user.Id] = {}; // پاک کردن پارامتر های فیلتر کاربر متقاضی
    // console.warn(filters);
    res.status(200).json('فیلترهای شما پاک شد.');
  } catch (error) {
    const message = error.messageک; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
router.post('/', authToken, async (req, res) => {
  try {
    if (req.body.Identity) {
      const Identity = req.body.Identity; // استخراج شناسه از درخواست فیلتر
      delete req.body['Identity']; // حذف شناسه قبلی
      filters[req.user.Id] = { Params: req.body, Identity }; // ساخت بدنه فیلتر با شناسه جدید
    }
    // console.warn(filters);
    res.status(200).json('فیلتر آماده شد');
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = { generateWhereClause, router };
