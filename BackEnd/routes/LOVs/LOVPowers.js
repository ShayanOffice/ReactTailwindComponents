const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVPowers } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVPowers.create({
      data: {
        Model: req.body.Model,
        SerialNum: req.body.SerialNum,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف نوع منبع‌تغذیه', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const powers = await LOVPowers.findMany({
      select: {
        Id: true,
        Model: true,
        SerialNum: true,
        Specs: true,
      },
    });
    res.json(powers);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Update/////////////////////
router.post('/:Id', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const powers = await LOVPowers.findMany({
      select: {
        Id: true,
        Model: true,
        SerialNum: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (powers.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVPowers.update({
      where: {
        Id: paramId,
      },
      data: {
        Model: req.body.Model,
        SerialNum: req.body.SerialNum,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'ویرایش  نوع منبع‌تغذیه', t, 6);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Delete/////////////////////
router.delete('/:Id', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const powers = await LOVPowers.findMany({
      select: {
        Id: true,
        Model: true,
        SerialNum: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (powers.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVPowers.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف نوع منبع‌تغذیه', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
