const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVConnections } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVConnections.create({
      data: {
        Type: req.body.Type,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه ارتباطات شبکه‌ای',
      t,
      4
    );
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////

router.get('/', authToken, async (req, res) => {
  try {
    const connections = await LOVConnections.findMany({
      select: {
        Id: true,
        Type: true,
      },
    });
    res.json(connections);
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
    const connections = await LOVConnections.findMany({
      select: {
        Id: true,
        Type: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (connections.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVConnections.update({
      where: {
        Id: paramId,
      },
      data: {
        Type: req.body.Type,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه ارتباطات شبکه‌ای',
      t,
      6
    );
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
    const connections = await LOVConnections.findMany({
      select: {
        Id: true,
        Type: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (connections.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVConnections.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه ارتباطات شبکه‌ای',
      t,
      5
    );
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
