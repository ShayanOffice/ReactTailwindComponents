const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const { AddLog } = require('../logs');
const { LOVOperations } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, async (req, res) => {
  try {
    const t = await LOVOperations.create({
      data: {
        Operation: req.body.Operation,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'ویرایش نوع فعالیت‌ها', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////

router.get('/', authToken, async (req, res) => {
  try {
    const tasks = await LOVOperations.findMany({
      select: {
        Id: true,
        Operation: true,
      },
    });
    res.json(tasks);
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
    const tasks = await LOVOperations.findMany({
      select: {
        Id: true,
        Operation: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (tasks.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVOperations.update({
      where: {
        Id: paramId,
      },
      data: {
        Operation: req.body.Operation,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه فعالیت‌ها',
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
router.delete('/:Id', authToken, async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const tasks = await LOVOperations.findMany({
      select: {
        Id: true,
        Operation: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (tasks.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVOperations.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه فعالیت‌ها',
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
