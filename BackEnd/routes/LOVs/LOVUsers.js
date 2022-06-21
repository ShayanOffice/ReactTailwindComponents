const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const authToken = require('../../middlewares/authToken');

const { Users } = new PrismaClient();

///////////////////// Get users list /////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    const itms = await Users.findMany({
      select: {
        Id: true,
        Name: true,
        Family: true,
        Provinces: {
          select: {
            Id: true,
            Province: true,
          },
        },
        LOVUserLevels: {
          select: {
            Id: true,
            Title: true,
          },
        },
      },
    });
    res.json(itms);
  } catch (error) {
    const message = error.message;
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
