const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const { AddLog } = require('../Logs');
const { LOVGPUs } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, async (req, res) => {
  try {
    const t = await LOVGPUs.create({
      data: {
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه پردازنده گرافیکی',
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
    const gpus = await LOVGPUs.findMany({
      select: {
        Id: true,
        Specs: true,
      },
    });
    res.json(gpus);
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
    const gpus = await LOVGPUs.findMany({
      select: {
        Id: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (gpus.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVGPUs.update({
      where: {
        Id: paramId,
      },
      data: {
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه پردازنده گرافیکی',
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
    const gpus = await LOVGPUs.findMany({
      select: {
        Id: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (gpus.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVGPUs.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه پردازنده گرافیکی',
      t,
      6
    );
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
