const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { generateWhereClause } = require('../filters');
const { orderbyClause } = require('../sort');
const authToken = require('../middlewares/authToken');
const { AddLog } = require('./logs');
const { generateItemsSkipTake } = require('../pagings');
const { Telephones } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, async (req, res) => {
  try {
    const telephone = await Telephones.create({
      data: {
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        LOVTelephoneId: parseInt(req.body.LOVTelephones.Id),
        PropertyCode: req.body.PropertyCode,
        ProvinceId: parseInt(req.body.Provinces.Id),
        UserId: req.body.Users.Id,
      },
    });
    await AddLog(req.body.TheUser, req.body, 'افزودن تلفن', telephone, 4);
    res.status(200).json(telephone);
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
    const itms = await Telephones.findMany({
      select: {
        Id: true,
        PropertyCode: true,
        LOVTelephones: {
          select: {
            Id: true,
            Model: true,
            Specs: true,
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
    res.json({ items: itms, pageCount, itemsCount });
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
        Telephones,
        whereClause,
        parseInt(pageNum),
        parseInt(pageItems)
      );

      const itms = await Telephones.findMany({
        select: {
          Id: true,
          PropertyCode: true,
          LOVTelephones: {
            select: {
              Id: true,
              Model: true,
              Specs: true,
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
    const results = await Telephones.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0) return res.status(400).send("doesn't exist");

    const telephone = await Telephones.update({
      where: {
        Id: paramId,
      },
      data: {
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        LOVTelephoneId: parseInt(req.body.LOVTelephones.Id),
        PropertyCode: req.body.PropertyCode,
        ProvinceId: parseInt(req.body.Provinces.Id),
        UserId: req.body.Users.Id,
      },
    });

    res.status(200).json(telephone);
    await AddLog(req.user.Id, req.body, 'ویرایش تلفن', telephone, 6);
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
    const results = await Telephones.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0) return res.status(400).send("doesn't exist");

    const p = await Telephones.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(p);
    await AddLog(req.user.Id, req.body, 'حذف تلفن', p, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
module.exports = router;
