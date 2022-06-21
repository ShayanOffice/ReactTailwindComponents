const router = require('express').Router();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authToken = require('../middlewares/authToken');
const userLevelCheck = require('../middlewares/userLevelCheck');
const { AddLog } = require('./logs');
const { Provinces } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, userLevelCheck(1), async (req, res) => {
  try {
    const p = await Provinces.create({
      data: {
        Province: req.body.Province,
      },
    });
    res.status(200).send(p);
    await AddLog(req.user.Id, req.body, 'افزودن استان', p, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const ostansCount = await Provinces.count();
    const ostans = await Provinces.findMany({
      // where: {
      //   ...(req.user.UserLevelId > 1
      //     ? { ProvinceId: { equals: req.user.ProvinceId } }
      //     : {}),
      // },
      select: {
        Id: true,
        Province: true,
      },
    });
    res.json(ostans);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

router.get('/:province', authToken, async (req, res) => {
  try {
    // const ostansCount = await Provinces.count();
    const ostans = await Provinces.findMany({
      where: {
        Province: {
          contains: req.params.province,
          // mode: 'insensitive', // Default value: default
        },
      },
      select: {
        Id: true,
        Province: true,
      },
    });
    res.json(ostans);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Update/////////////////////
router.post('/:Id', authToken, userLevelCheck(1), async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const ostans = await Provinces.findMany({
      select: {
        Id: true,
        Province: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (ostans.length === 0) return res.status(400).send("doesn't exist");

    const p = await Provinces.update({
      where: {
        Id: paramId,
      },
      data: {
        Province: req.body.Province,
      },
    });
    res.status(200).send(p);
    await AddLog(req.user.Id, req.body, 'ویرایش استان', p, 6);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Delete/////////////////////
router.delete('/:Id', authToken, userLevelCheck(1), async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const ostans = await Provinces.findMany({
      select: {
        Id: true,
        Province: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (ostans.length === 0) return res.status(400).send("doesn't exist");

    const p = await Provinces.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(p);
    await AddLog(req.user.Id, req.body, 'حذف استان', p, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
module.exports = router;
