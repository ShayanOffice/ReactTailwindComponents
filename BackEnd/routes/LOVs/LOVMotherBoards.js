const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');
const { AddLog } = require('../logs');
const { LOVMotherBoards } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', authToken, async (req, res) => {
  try {
    const t = await LOVMotherBoards.create({
      data: {
        Model: req.body.Model,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'افزودن نوع مادربرد', t, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////

router.get('/', authToken, async (req, res) => {
  try {
    const mboards = await LOVMotherBoards.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
    });
    res.json(mboards);
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
    const mboards = await LOVMotherBoards.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (mboards.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVMotherBoards.update({
      where: {
        Id: paramId,
      },
      data: {
        Model: req.body.Model,
        Specs: req.body.Specs,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, ' ویرایش نوع مادربرد', t, 6);
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
    const mboards = await LOVMotherBoards.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (mboards.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVMotherBoards.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
    await AddLog(req.user.Id, req.body, 'حذف نوع مادربرد', t, 5);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
