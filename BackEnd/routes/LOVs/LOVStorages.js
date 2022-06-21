const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVStorages } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVStorages.create({
      data: {
        Type: req.body.Type,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'افزودن نوع حافظه‌سخت', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const storages = await LOVStorages.findMany({
      select: {
        Id: true,
        Type: true,
        Specs: true,
      },
    });
    res.json(storages);
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
    const storages = await LOVStorages.findMany({
      select: {
        Id: true,
        Type: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (storages.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVStorages.update({
      where: {
        Id: paramId,
      },
      data: {
        Type: req.body.Type,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'ویرایش نوع حافظه‌سخت', t, 6);
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
    const storages = await LOVStorages.findMany({
      select: {
        Id: true,
        Type: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (storages.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVStorages.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف نوع حافظه‌سخت', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
