const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVApps } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVApps.create({
      data: {
        Name: req.body.Name,
      },
    });
    res.status(200).send(t);
    // add transacrion Log
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه سامانه',
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
    const apps = await LOVApps.findMany({
      select: {
        Id: true,
        Name: true,
      },
    });
    res.json(apps);
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
    const apps = await LOVApps.findMany({
      select: {
        Id: true,
        Name: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (apps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVApps.update({
      where: {
        Id: paramId,
      },
      data: {
        Name: req.body.Name,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه سامانه',
      t,
      5
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
    const apps = await LOVApps.findMany({
      select: {
        Id: true,
        Name: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (apps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVApps.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه سامانه',
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
