const authToken = require('./middlewares/authToken');
const router = require('express').Router();

async function generateItemsSkipTake(
  PrismaModel,
  whereClause,
  pageNum,
  itemsPerPage
) {
  const allItms = await PrismaModel.findMany({
    select: {
      Id: true,
    },
    where: whereClause,
  });
  ////////////////////////////////////////
  const itemsCount = allItms.length;
  var paging = { take: itemsPerPage, skip: itemsPerPage * (pageNum - 1) };
  console.log('pg', paging);
  var pageCount =
    itemsCount % itemsPerPage == 0
      ? itemsCount / itemsPerPage
      : Math.ceil(itemsCount / itemsPerPage);

  return { itemsCount, paging, pageCount };
}

router.get('/', authToken, async (req, res) => {
  try {
    pagingsres.status(200).json('filters Cleared');
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

router.post('/', authToken, async (req, res) => {
  try {
    if (req.body.Identity) {
      const Identity = req.body.Identity;
      delete req.body['Identity'];
    }
    res.status(200).json('filters Set');
  } catch (error) {
    const message = error.message;
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = {
  generateItemsSkipTake,
  router,
};
