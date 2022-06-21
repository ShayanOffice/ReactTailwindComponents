const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { LOVMonitors } = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', async (req, res) => {
  try {
    const t = await LOVMonitors.create({
      data: {
        Model: req.body.Model,
        Specs: req.body.Specs,
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
    const monitors = await LOVMonitors.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
    });
    res.json(monitors);
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
    const monitors = await LOVMonitors.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (monitors.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVMonitors.update({
      where: {
        Id: paramId,
      },
      data: {
        Model: req.body.Model,
        Specs: req.body.Specs,
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
    const monitors = await LOVMonitors.findMany({
      select: {
        Id: true,
        Model: true,
        Specs: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (monitors.length === 0) return res.status(400).send("doesn't exist");

    const t = await LOVMonitors.delete({
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
