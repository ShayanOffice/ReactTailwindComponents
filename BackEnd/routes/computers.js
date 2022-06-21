const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { generateWhereClause } = require('../filters');
const authToken = require('../middlewares/authToken');
const { generateItemsSkipTake } = require('../pagings');
const { orderbyClause } = require('../sort');
const { AddLog } = require('./logs');
const {
  Computers,
  Memories,
  Apps,
  Connections,
  OSes,
  Softwares,
  Storages,
  Logs,
} = new PrismaClient();

/////////////////////Create/////////////////////
router.post('/', authToken, async (req, res) => {
  var computer;
  try {
    computer = await Computers.create({
      data: {
        ...req.body.Computer,
      },
    });
    const memories =
      req.body.Memories &&
      (await Memories.createMany({
        data: req.body.Memories.map((Memory) => ({
          ...Memory,
          ComputerId: computer.Id,
        })),
      }));
    const apps =
      req.body.Apps &&
      (await Apps.createMany({
        data: req.body.Apps.map((App) => ({ ...App, ComputerId: computer.Id })),
      }));
    const conns =
      req.body.Connections &&
      (await Connections.createMany({
        data: req.body.Connections.map((Conn) => ({
          ...Conn,
          ComputerId: computer.Id,
        })),
      }));
    const oses =
      req.body.OSes &&
      (await OSes.createMany({
        data: req.body.OSes.map((OS) => ({ ...OS, ComputerId: computer.Id })),
      }));
    const softs =
      req.body.Softwares &&
      (await Softwares.createMany({
        data: req.body.Softwares.map((soft) => ({
          ...soft,
          ComputerId: computer.Id,
        })),
      }));
    const stos =
      req.body.Storages &&
      (await Storages.createMany({
        data: req.body.Storages.map((sto) => ({
          ...sto,
          ComputerId: computer.Id,
        })),
      }));
    const resObj = { computer, memories, apps, conns, oses, softs, stos };
    // add transacrion Log
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن سخت افزار ها',
      resObj,
      4
    );
    res.status(200).json(resObj);
  } catch (error) {
    if (computer)
      await Computers.delete({
        where: {
          Id: computer.Id,
        },
      });
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
/////////////////////Read/////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    var whereClause = generateWhereClause(req.user.Id);
    const itms = await Computers.findMany({
      select: {
        Id: true,
        PropertyCode: true,
        Users: {
          select: {
            Id: true,
            Name: true,
            Family: true,
          },
        },
        Provinces: {
          select: {
            Id: true,
            Province: true,
          },
        },
        LOVDepartments: {
          select: {
            Id: true,
            Department: true,
          },
        },
        LOVMotherBoards: {
          select: {
            Id: true,
            Model: true,
          },
        },
        LOVCPUs: {
          select: {
            Id: true,
            Model: true,
          },
        },
        LOVGPUs: {
          select: {
            Id: true,
            Specs: true,
          },
        },
        LOVPowers: {
          select: {
            Id: true,
            Model: true,
          },
        },
        LOVLaptops: {
          select: {
            Id: true,
            Model: true,
          },
        },
        Memories: {
          select: {
            Id: true,
            Count: true,
            LOVMemories: {
              select: {
                Id: true,
                Capacity: true,
                Type: true,
              },
            },
          },
        },
        Storages: {
          select: {
            Id: true,
            Count: true,
            LOVStorages: {
              select: {
                Id: true,
                Type: true,
                Specs: true,
              },
            },
          },
        },
        Connections: {
          select: {
            Id: true,
            NetworkName: true,
            Ip: true,
            LOVConnections: {
              select: {
                Id: true,
                Type: true,
              },
            },
          },
        },
        OSes: {
          select: {
            Id: true,
            LOVOSes: {
              select: {
                Id: true,
                Specs: true,
              },
            },
          },
        },
        Softwares: {
          select: {
            Id: true,
            LOVSoftwares: {
              select: {
                Id: true,
                Specs: true,
              },
            },
          },
        },
        Apps: {
          select: {
            Id: true,
            LOVApps: {
              select: {
                Id: true,
                Name: true,
              },
            },
          },
        },
      },
      where: whereClause,
      orderBy: orderbyClause(req.user.Id),
    });
    res.json({ items: itms, pageCount, itemsCount });
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

router.get(
  '/pageItems::pageItems&pageNum::pageNum',
  authToken,
  async (req, res) => {
    try {
      const { pageItems, pageNum } = req.params;
      var whereClause = generateWhereClause(req.user.Id);
      const { itemsCount, paging, pageCount } = await generateItemsSkipTake(
        Computers,
        whereClause,
        parseInt(pageNum),
        parseInt(pageItems)
      );
      const itms = await Computers.findMany({
        select: {
          Id: true,
          PropertyCode: true,
          Users: {
            select: {
              Id: true,
              Name: true,
              Family: true,
            },
          },
          Provinces: {
            select: {
              Id: true,
              Province: true,
            },
          },
          LOVDepartments: {
            select: {
              Id: true,
              Department: true,
            },
          },
          LOVMotherBoards: {
            select: {
              Id: true,
              Model: true,
            },
          },
          LOVCPUs: {
            select: {
              Id: true,
              Model: true,
            },
          },
          LOVGPUs: {
            select: {
              Id: true,
              Specs: true,
            },
          },
          LOVPowers: {
            select: {
              Id: true,
              Model: true,
            },
          },
          LOVLaptops: {
            select: {
              Id: true,
              Model: true,
            },
          },
          Memories: {
            select: {
              Id: true,
              Count: true,
              LOVMemories: {
                select: {
                  Id: true,
                  Capacity: true,
                  Type: true,
                },
              },
            },
          },
          Storages: {
            select: {
              Id: true,
              Count: true,
              LOVStorages: {
                select: {
                  Id: true,
                  Type: true,
                  Specs: true,
                },
              },
            },
          },
          Connections: {
            select: {
              Id: true,
              NetworkName: true,
              Ip: true,
              LOVConnections: {
                select: {
                  Id: true,
                  Type: true,
                },
              },
            },
          },
          OSes: {
            select: {
              Id: true,
              LOVOSes: {
                select: {
                  Id: true,
                  Specs: true,
                },
              },
            },
          },
          Softwares: {
            select: {
              Id: true,
              LOVSoftwares: {
                select: {
                  Id: true,
                  Specs: true,
                },
              },
            },
          },
          Apps: {
            select: {
              Id: true,
              LOVApps: {
                select: {
                  Id: true,
                  Name: true,
                },
              },
            },
          },
        },
        ...paging,
        where: whereClause,
        orderBy: orderbyClause(req.user.Id),
      });
      res.json({ items: itms, pageCount, itemsCount });
    } catch (error) {
      const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
      console.log(message);
      console.log(message);
      res.status(400).send({ error, message });
    }
  }
);

/////////////////////Update/////////////////////
router.post('/:Id', authToken, async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const coms = await Computers.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (coms.length === 0) return res.status(400).send("doesn't exist");

    const computer = await Computers.update({
      where: {
        Id: paramId,
      },
      data: {
        ...req.body.Computer,
      },
    });

    await Memories.deleteMany({
      where: {
        ComputerId: computer.Id,
      },
    });
    await Apps.deleteMany({
      where: {
        ComputerId: computer.Id,
      },
    });
    await Connections.deleteMany({
      where: {
        ComputerId: computer.Id,
      },
    });
    await Storages.deleteMany({
      where: {
        ComputerId: computer.Id,
      },
    });
    await Softwares.deleteMany({
      where: {
        ComputerId: computer.Id,
      },
    });
    await OSes.deleteMany({
      where: {
        ComputerId: computer.Id,
      },
    });

    const memories =
      req.body.Memories &&
      (await Memories.createMany({
        data: req.body.Memories.map((Memory) => ({
          ...Memory,
          ComputerId: computer.Id,
        })),
      }));
    const apps =
      req.body.Apps &&
      (await Apps.createMany({
        data: req.body.Apps.map((App) => ({ ...App, ComputerId: computer.Id })),
      }));
    const conns =
      req.body.Connections &&
      (await Connections.createMany({
        data: req.body.Connections.map((Conn) => ({
          ...Conn,
          ComputerId: computer.Id,
        })),
      }));
    const oses =
      req.body.OSes &&
      (await OSes.createMany({
        data: req.body.OSes.map((OS) => ({ ...OS, ComputerId: computer.Id })),
      }));
    const softs =
      req.body.Softwares &&
      (await Softwares.createMany({
        data: req.body.Softwares.map((soft) => ({
          ...soft,
          ComputerId: computer.Id,
        })),
      }));
    const stos =
      req.body.Storages &&
      (await Storages.createMany({
        data: req.body.Storages.map((sto) => ({
          ...sto,
          ComputerId: computer.Id,
        })),
      }));

    const resObj = { computer, memories, apps, conns, oses, softs, stos };
    res.status(200).json(resObj);
    // add transacrion Log
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن سخت افزار ها',
      resObj,
      6
    );
  } catch (error) {
    const message = error.message?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});
/////////////////////Delete/////////////////////
router.delete('/:Id', authToken, async (req, res) => {
  try {
    const paramId = parseInt(req.params.Id);
    const coms = await Computers.findMany({
      select: {
        Id: true,
        PropertyCode: true,
      },
      where: {
        Id: paramId,
      },
    });
    if (coms.length === 0) return res.status(400).send("doesn't exist");

    const p = await Computers.delete({
      where: {
        Id: paramId,
      },
    });
    res.status(200).send(p);
    await AddLog(
      req.user.Id,
      req.body,
      'فرم ویرایش و افزودن سخت افزار ها',
      p,
      5
    );
  } catch (error) {
    const message = error.message?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

module.exports = router;
