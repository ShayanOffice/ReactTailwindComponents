const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { LOVResults } = new PrismaClient();
const userLevelCheck = require('../../middlewares/userLevelCheck');
/////////////////////Create/////////////////////

router.post('/', userLevelCheck(2), async (req, res) => {
  try {
    const t = await LOVResults.create({
      data: {
        Result: req.body.Result,
      },
    });
    res.status(200).send(t);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Read/////////////////////

router.get('/', async (req, res) => {
  try {
    const results = await LOVResults.findMany({
      select: {
        Id: true,
        Result: true,
      },
    });
    res.json(results);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Update/////////////////////

router.post('/:Id', userLevelCheck(2), async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const temps = await LOVResults.findMany({
      select: {
        Id: true,
        Result: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (temps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVResults.update({
      where: {
        Id: paramId,
      },
      data: {
        Result: req.body.Result,
      },
    });
    res.status(200).send(t);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Delete/////////////////////

router.delete('/:Id', userLevelCheck(2), async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const temps = await LOVResults.findMany({
      select: {
        Id: true,
        Result: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (temps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVResults.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(t);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
