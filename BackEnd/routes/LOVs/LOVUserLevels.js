const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { AddLog } = require('../logs');
const { LOVUserLevels } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVUserLevels.create({
      data: {
        Title: req.body.Title,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'افزودن سطح دسترسی کاربری', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const levels = await LOVUserLevels.findMany({
      // where: {
      //   Id: { gte: req.user.UserLevelId },
      // },
      select: {
        Id: true,
        Title: true,
      },
    });
    res.json(levels);
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

    const levels = await LOVUserLevels.findMany({
      select: {
        Id: true,
        Title: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (levels.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVUserLevels.update({
      where: {
        Id: paramId,
      },
      data: {
        Title: req.body.Title,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, ' ویرایش سطح دسترسی کاربری', t, 6);
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
    const levels = await LOVUserLevels.findMany({
      select: {
        Id: true,
        Title: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (levels.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVUserLevels.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف سطح دسترسی کاربری', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
