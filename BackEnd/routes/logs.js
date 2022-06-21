const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { generateItemsSkipTake } = require('../pagings');
const { generateWhereClause } = require('../filters');
const { orderbyClause } = require('../sort');
const authToken = require('../middlewares/authToken');
const { Logs } = new PrismaClient();

//////////////////   Create   \\\\\\\\\\\\\\\\\\
const AddLog = async (UserId, reqBody, module, data, LOVOperationsId) => {
  try {
    await Logs.create({
      data: {
        UserId,
        LOVOperationsId,
        Module: module,
        Data: JSON.stringify(data),
        Summary: reqBody.Summary,
        Agent: reqBody.Agent,
      },
    });
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
};

//////////////////   Read   \\\\\\\\\\\\\\\\\\
router.get('/', authToken, async (req, res) => {
  try {
    var whereClause = generateWhereClause(req.user.Id);

    const itms = await Logs.findMany({
      select: {
        Id: true,
        Module: true,
        Summary: true,
        LogDateTime: true,
        LOVOperations: {
          select: {
            Operation: true,
          },
        },
        Users: {
          select: {
            Id: true,
            Name: true,
            Family: true,
          },
        },
      },
      where: whereClause,
      orderBy: orderbyClause(req.user.Id),
    });
    res.json(itms);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

router.get(
  '/pageItems::pageItems&pageNum::pageNum',
  authToken,
  async (req, res) => {
    try {
      const { pageItems, pageNum } = req.params;
      var whereClause = generateWhereClause(req.user.Id);
      const { itemsCount, paging, pageCount } = await generateItemsSkipTake(
        Logs,
        whereClause,
        parseInt(pageNum),
        parseInt(pageItems)
      );
      const itms = await Logs.findMany({
        select: {
          Id: true,
          Module: true,
          Summary: true,
          LogDateTime: true,
          LOVOperations: {
            select: {
              Operation: true,
            },
          },
          Users: {
            select: {
              Id: true,
              Name: true,
              Family: true,
            },
          },
        },
        ...paging,
        where: whereClause,
        orderBy: orderbyClause(req.user.Id),
      });
      res.json({ items: itms, pageCount, itemsCount });
    } catch (error) {
      const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
      console.log(message);
      console.log(message);
      res.status(400).send({ error, message });
    }
  }
);
module.exports = { AddLog, router };
