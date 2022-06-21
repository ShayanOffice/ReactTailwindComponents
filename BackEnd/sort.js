const _ = require('lodash');
const authToken = require('./middlewares/authToken');
const router = require('express').Router();
// sort ساختار => {[User1]: { Identity: 'Modelx', Sorts: { colA1: 'asc', colB1: '', colC1: 'desc', ...}},
//             => [User2]: { Identity: 'Modely', Sorts: { colA2: '', colB2: 'desc', colC2: 'desc', ...}},
//                ....}
// {
//    colA1: 'asc',
//    colB1: '',
//    .
//    .
//    .
// }
const sorts = {};
function orderbyClause(userId) {
  var orderBy = [];
  if (sorts[userId]?.Sorts) {
    for (let i = 0; i < Object.keys(sorts[userId].Sorts).length; i++) {
      const colName = Object.keys(sorts[userId].Sorts)[i];

      // لحاظ فقط موارد صعودی و نزولی
      if (sorts[userId].Sorts[colName] != '') {
        const obj = {};
        _.set(obj, colName, sorts[userId].Sorts[colName]);
        orderBy.push(obj);
      }
    }
  } else return [{ Id: 'asc' }];
  if (orderBy == []) return [{ Id: 'asc' }];
  return orderBy;
}

router.get('/', authToken, async (req, res) => {
  try {
    sorts[req.user.Id] = {};
    // console.warn(sorts);
    res.status(200).json('sorts Cleared');
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

router.post('/', authToken, async (req, res) => {
  try {
    let obj = {};
    Object.keys(req.body.Sort).forEach((key) => {
      if (req.body.Sort[key] != '') obj[key] = req.body.Sort[key];
    });

    if (req.body.Identity) {
      sorts[req.user.Id] = {
        Identity: req.body.Identity,
        Sorts: obj,
      };
    }
    res.status(200).json('ترتیب نمابش تعیین گردید');
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = { orderbyClause, router };
