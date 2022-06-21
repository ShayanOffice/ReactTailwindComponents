const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { LOVTemplate } = new PrismaClient();

/////////////////////Create/////////////////////

router.post('/', async (req, res) => {
  try {
    const t = await LOVTemplate.create({
      data: {
        Template: req.body.Template,
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
    const temps = await LOVTemplate.findMany({
      select: {
        Id: true,
        Template: true,
      },
    });
    res.json(temps);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

/////////////////////Update/////////////////////
router.post('/:Id', async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const temps = await LOVTemplate.findMany({
      select: {
        Id: true,
        Template: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (temps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVTemplate.update({
      where: {
        Id: paramId,
      },
      data: {
        Template: req.body.Template,
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

router.delete('/:Id', async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const temps = await LOVTemplate.findMany({
      select: {
        Id: true,
        Template: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (temps.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVTemplate.delete({
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
