const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { generateItemsSkipTake } = require('../pagings');
const { generateWhereClause } = require('../filters');
const { orderbyClause } = require('../sort');
const authToken = require('../middlewares/authToken');
const { AddLog } = require('./logs');
const { Printers } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, async (req, res) => {
  try {
    const printer = await Printers.create({
      data: {
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        LOVPrinterId: parseInt(req.body.LOVPrinters.Id),
        PropertyCode: req.body.PropertyCode,
        ProvinceId: parseInt(req.body.Provinces.Id),
        UserId: req.body.Users.Id,
      },
    });
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن چاپگر',
      printer,
      4
    );
    res.status(200).json(printer);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    var whereClause = generateWhereClause(req.user.Id);
    const itms = await Printers.findMany({
      select: {
        Id: true,
        PropertyCode: true,
        LOVPrinters: {
          select: {
            Id: true,
            Model: true,
            Name: true,
          },
        },
        Users: {
          select: {
            Id: true,
            Name: true,
            Family: true,
          },
        },
        Provinces: {
          select: {
            Id: true,
            Province: true,
          },
        },
        LOVDepartments: {
          select: {
            Id: true,
            Department: true,
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
        Printers,
        whereClause,
        parseInt(pageNum),
        parseInt(pageItems)
      );
      const itms = await Printers.findMany({
        select: {
          Id: true,
          PropertyCode: true,
          LOVPrinters: {
            select: {
              Id: true,
              Model: true,
              Name: true,
            },
          },
          Users: {
            select: {
              Id: true,
              Name: true,
              Family: true,
            },
          },
          Provinces: {
            select: {
              Id: true,
              Province: true,
            },
          },
          LOVDepartments: {
            select: {
              Id: true,
              Department: true,
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
      res.status(400).send({ error, message });
    }
  }
);

/////////////////////Update/////////////////////
router.post('/:Id', authToken, async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const results = await Printers.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0) return res.status(400).send("doesn't exist");

    const printer = await Printers.update({
      where: {
        Id: paramId,
      },
      data: {
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        LOVPrinterId: parseInt(req.body.LOVPrinters.Id),
        PropertyCode: req.body.PropertyCode,
        ProvinceId: parseInt(req.body.Provinces.Id),
        UserId: req.body.Users.Id,
      },
    });

    res.status(200).json(printer);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن پرینتر',
      printer,
      6
    );
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Delete/////////////////////
router.delete('/:Id', authToken, async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const results = await Printers.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0) return res.status(400).send("doesn't exist");

    const p = await Printers.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(p);
    await AddLog(req.user.Id, req.body, 'فرم ویرایش و افزودن پرینتر', p, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
module.exports = router;
