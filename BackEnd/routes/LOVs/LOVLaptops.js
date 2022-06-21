const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const { AddLog } = require('../logs');
const { LOVLaptops } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, async (req, res) => {
  try {
    const t = await LOVLaptops.create({
      data: {
        Model: req.body.Model,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه لپتاپ',
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
    const laptops = await LOVLaptops.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
    });
    res.json(laptops);
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
    const laptops = await LOVLaptops.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (laptops.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVLaptops.update({
      where: {
        Id: paramId,
      },
      data: {
        Model: req.body.Model,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه لپتاپ',
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
    const laptops = await LOVLaptops.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (laptops.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVLaptops.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن اطلاعات پایه لپتاپ',
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
