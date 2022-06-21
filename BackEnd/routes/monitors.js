const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { generateItemsSkipTake } = require('../pagings');
const { generateWhereClause } = require('../filters');
const { orderbyClause } = require('../sort');
const authToken = require('../middlewares/authToken');
const { AddLog } = require('./logs');
const { Monitors } = new PrismaClient();
/////////////////////Create/////////////////////
router.post('/', authToken, async (req, res) => {
  try {
    const monitor = await Monitors.create({
      data: {
        UserId: req.body.Users.Id,
        LOVMonitorId: parseInt(req.body.LOVMonitors.Id),
        ProvinceId: parseInt(req.body.Provinces.Id),
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        PropertyCode: req.body.PropertyCode,
      },
    });
    await AddLog(
      req.user.Id,
      req.body,
      'افزودن صفحه نمایش' + 'req.socket.remoteAddress',
      monitor,
      4
    );
    res.status(200).json(monitor);
  } catch (error) {
    const message = error.message; //.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    var whereClause = generateWhereClause(req.user.Id);
    const itms = await Monitors.findMany({
      select: {
        Id: true,
        PropertyCode: true,
        LOVMonitors: {
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
        Monitors,
        whereClause,
        parseInt(pageNum),
        parseInt(pageItems)
      );
      const itms = await Monitors.findMany({
        select: {
          Id: true,
          PropertyCode: true,
          LOVMonitors: {
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
      console.log(message);
      res.status(400).send({ error, message });
    }
  }
);

/////////////////////Update////////////////////
router.post('/:Id', authToken, async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const results = await Monitors.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0) return res.status(400).send("doesn't exist");

    const monitor = await Monitors.update({
      where: {
        Id: paramId,
      },
      data: {
        ProvinceId: parseInt(req.body.Provinces.Id),
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        PropertyCode: req.body.PropertyCode,
        LOVMonitorId: parseInt(req.body.LOVMonitors.Id),
        UserId: req.body.Users.Id,
      },
    });

    await AddLog(
      req.user.Id,
      req.body,
      `ویرایش مانیتور  @ IP:` +
        req.socket.remoteAddress.replace(
          /.*[^0-9](([0-9]{1,3}\.){3}[0-9]{1,3}).*/,
          '$1'
        ),
      monitor,
      6
    );
    res.status(200).json(monitor);
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
    const results = await Monitors.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (results.length === 0) return res.status(400).send("doesn't exist");

    const p = await Monitors.delete({
      where: {
        Id: paramId,
      },
    });
    await AddLog(req.user.Id, req.body, 'حذف صفحه نمایش', p, 5);
    res.status(200).send(p);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
module.exports = router;
