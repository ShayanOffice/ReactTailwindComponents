const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVPrinters } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVPrinters.create({
      data: {
        Model: req.body.Model,
        Name: req.body.Name,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'افزودن نوع پرینتر', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const printers = await LOVPrinters.findMany({
      select: {
        Id: true,
        Model: true,
        Name: true,
      },
    });
    res.json(printers);
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
    const printers = await LOVPrinters.findMany({
      select: {
        Id: true,
        Model: true,
        Name: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (printers.length === 0)
      return res.status(400).send('چاپگر منتخب وجود ندارد');
    const t = await LOVPrinters.update({
      where: {
        Id: paramId,
      },
      data: {
        Model: req.body.Model,
        Name: req.body.Name,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'ویرایش  نوع پرینتر', t, 6);
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
    const printers = await LOVPrinters.findMany({
      select: {
        Id: true,
        Model: true,
        Name: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (printers.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVPrinters.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف نوع پرینتر', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
