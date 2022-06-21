
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


module.exports = {
  generateItemsSkipTake,
  router,
};
