const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { Logs } = new PrismaClient();

const AddLog = async (reqBody, module, data, LOVOperationsId) => {
  try {
    await Logs.create({
      data: {
        UserId: reqBody.TheUser,
        LOVOperationsId,
        Module: module,
        Data: JSON.stringify(data),
        Summary: reqBody.Summary,
        Agent: reqBody.Agent,
      },
    });
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    console.log(message);
    res.status(400).send({ error, message });
  }
};

module.exports = { AddLog };
