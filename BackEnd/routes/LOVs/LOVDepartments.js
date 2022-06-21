const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { AddLog } = require('../logs');
const authToken = require('../../middlewares/authToken');
const userLevelCheck = require('../../middlewares/userLevelCheck');
const { LOVDepartments } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVDepartments.create({
      data: {
        Department: req.body.Department,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه واحد سازمانی',
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
    const deps = await LOVDepartments.findMany({
      select: {
        Id: true,
        Department: true,
      },
    });
    res.json(deps);
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
    const deps = await LOVDepartments.findMany({
      select: {
        Id: true,
        Department: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (deps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVDepartments.update({
      where: {
        Id: paramId,
      },
      data: {
        Department: req.body.Department,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه واحد سازمانی',
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
    const deps = await LOVDepartments.findMany({
      select: {
        Id: true,
        Department: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (deps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVDepartments.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه واحد سازمانی',
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
