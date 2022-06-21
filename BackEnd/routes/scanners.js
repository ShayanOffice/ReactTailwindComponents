const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { generateItemsSkipTake } = require('../pagings');
const { generateWhereClause } = require('../filters');
const { orderbyClause } = require('../sort');
const authToken = require('../middlewares/authToken');
const { AddLog } = require('./logs');
const { Scanners } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, async (req, res) => {
  try {
    const scanner = await Scanners.create({
      data: {
        ProvinceId: parseInt(req.body.Provinces.Id),
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        PropertyCode: req.body.PropertyCode,
        LOVScannerId: parseInt(req.body.LOVScanners.Id),
        UserId: req.body.Users.Id,
      },
    });
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن پویشگر',
      scanner,
      4
    );
    res.status(200).json(scanner);
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
    const itms = await Scanners.findMany({
      select: {
        Id: true,
        PropertyCode: true,
        LOVScanners: {
          select: {
            Id: true,
            Model: true,
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
        Scanners,
        whereClause,
        parseInt(pageNum),
        parseInt(pageItems)
      );

      const itms = await Scanners.findMany({
        select: {
          Id: true,
          PropertyCode: true,
          LOVScanners: {
            select: {
              Id: true,
              Model: true,
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
    const results = await Scanners.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0) return res.status(400).send("doesn't exist");

    const scanner = await Scanners.update({
      where: {
        Id: paramId,
      },
      data: {
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        LOVScannerId: parseInt(req.body.LOVScanners.Id),
        PropertyCode: req.body.PropertyCode,
        ProvinceId: parseInt(req.body.Provinces.Id),
        UserId: req.body.Users.Id,
      },
    });
    console.warn(req.body);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اسکنر',
      scanner,
      6
    );
    res.status(200).json(scanner);
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
    const results = await Scanners.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0)
      return res.status(400).send('مورد حذفی یافت نمیگردد');

    const p = await Scanners.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(p);
    await AddLog(req.user.Id, req.body, 'فرم ویرایش و افزودن اسکنر', p, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
module.exports = router;
