const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const { AddLog } = require('../logs');
const { LOVMemories } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, async (req, res) => {
  try {
    const t = await LOVMemories.create({
      data: {
        Capacity: req.body.Capacity,
        Type: req.body.Type,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'افزودن نوع حافظه', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////

router.get('/', authToken, async (req, res) => {
  try {
    const rams = await LOVMemories.findMany({
      select: {
        Id: true,
        Capacity: true,
        Type: true,
      },
    });
    res.json(rams);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Update/////////////////////

router.post('/:Id', authToken, async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const rams = await LOVMemories.findMany({
      select: {
        Id: true,
        Capacity: true,
        Type: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (rams.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVMemories.update({
      where: {
        Id: paramId,
      },
      data: {
        Capacity: req.body.Capacity,
        Type: req.body.Type,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'ویرایش نوع حافظه', t, 6);
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
    const rams = await LOVMemories.findMany({
      select: {
        Id: true,
        Capacity: true,
        Type: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (rams.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVMemories.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'فرم حذف نوع حافظه', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
