const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVOSes } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVOSes.create({
      data: {
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'افزودن نوع سیستم‌عامل', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const OSs = await LOVOSes.findMany({
      select: {
        Id: true,
        Specs: true,
      },
    });
    res.json(OSs);
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
    const OSs = await LOVOSes.findMany({
      select: {
        Id: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (OSs.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVOSes.update({
      where: {
        Id: paramId,
      },
      data: {
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'ویرایش نوع سیستم‌عامل', t, 6);
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
    const OSs = await LOVOSes.findMany({
      select: {
        Id: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (OSs.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVOSes.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف نوع سیستم‌عامل', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
