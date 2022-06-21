const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVScanners } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVScanners.create({
      data: {
        Model: req.body.Model,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'افزودن نوع اسکنر', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const scanners = await LOVScanners.findMany({
      select: {
        Id: true,
        Model: true,
      },
    });
    res.json(scanners);
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
    const scanners = await LOVScanners.findMany({
      select: {
        Id: true,
        Model: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (scanners.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVScanners.update({
      where: {
        Id: paramId,
      },
      data: {
        Model: req.body.Model,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'ویرایش  نوع اسکنر', t, 6);
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
    const scanners = await LOVScanners.findMany({
      select: {
        Id: true,
        Model: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (scanners.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVScanners.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف نوع اسکنر', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
