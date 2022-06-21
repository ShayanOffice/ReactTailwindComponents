const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { generateItemsSkipTake } = require('../pagings');
const { generateWhereClause } = require('../filters');
const { orderbyClause } = require('../sort');
const { AddLog } = require('./logs');
const authToken = require('../middlewares/authToken');
const userLevelCheck = require('../middlewares/userLevelCheck');

const { Provinces, Users } = new PrismaClient();
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
};

let refreshTokens = [];
// req.user:{
//   Id: '0019545134',
//   ProvinceId: 131,
//   LOVDepartmentId: 2,
//   UserLevelId: 3,
//   Password: '$2b$10$dLY5ztNObR2CHWGZ.Q0gZ..Tp8nR.IHGGuDT6U4FgaWYgkGtntS9O',
//   Name: 'کاربر بروزرسانی شده',
//   Family: 'حسنی',
//   PhoneNumber: '09999999999',
//   createAt: '2022-05-22T10:58:28.554Z',
//   updatedAt: null,
//   iat: 1653382733
// }

///////////////////// Get users list /////////////////////
router.get('/', authToken, async (req, res) => {
  try {
    var whereClause = generateWhereClause(req.user.Id);
    const itms = await Users.findMany({
      select: {
        Id: true,
        Name: true,
        Family: true,
        PhoneNumber: true,
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
        LOVUserLevels: {
          select: {
            Id: true,
            Title: true,
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
        Users,
        whereClause,
        parseInt(pageNum),
        parseInt(pageItems)
      );
      const itms = await Users.findMany({
        select: {
          Id: true,
          Name: true,
          Family: true,
          PhoneNumber: true,
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
          LOVUserLevels: {
            select: {
              Id: true,
              Title: true,
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
      res.status(400).send({ error, message });
    }
  }
);

router.get('/all', authToken, async (req, res) => {
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
      },
    });
    res.json(itms);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

///////////////////// Get user profile /////////////////////
router.get('/profile', authToken, async (req, res) => {
  const user = await Users.findUnique({
    // where: {
    //   Id: req.user.Id,
    // },
    select: {
      Id: true,
      Name: true,
      Family: true,
      PhoneNumber: true,
      ProvinceId: true,
      LOVDepartmentId: true,
      UserLevelId: true,
    },
  });
  res.json(user);
});

/////////////////////Login user/////////////////////
router.post('/login', async (req, res) => {
  const theUser = await Users.findUnique({
    where: {
      Id: req.body.Id,
    },
  });
  if (!theUser) return res.status(400).send("User doesn't exist.");
  const hisProvince = await Provinces.findUnique({
    where: {
      Id: theUser.ProvinceId,
    },
  });
  if (!hisProvince) return res.status(400).send('کاربر بدون استان است');
  theUser['Province'] = hisProvince.Province;
  // ValIdate Body?
  // compare tha Pass
  try {
    if (await bcrypt.compare(req.body.Password, theUser.Password)) {
      const accessToken = generateAccessToken(theUser);
      const refreshToken = jwt.sign(theUser, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      const resObj = { accessToken, refreshToken, User: theUser };
      const recObj = { User: theUser.Id };
      res.status(200).json(resObj);
      await AddLog(theUser.Id, req.body, 'مدیریت کاربران / ورود', recObj, 1);
    } else res.send('not allowed');
  } catch (error) {
    // const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    const message = error.message;
    console.warn(message);
    res.status(500).send('there was an error');
  }
});

///////////////////// Check user alive tru TOKEN /////////////////////
router.post('/token', async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const {
      Id,
      Name,
      Family,
      PhoneNumber,
      ProvinceId,
      LOVDepartmentId,
      UserLevelId,
    } = user;
    const accessToken = generateAccessToken({
      Id,
      Name,
      Family,
      PhoneNumber,
      ProvinceId,
      LOVDepartmentId,
      UserLevelId,
    });
    res.json(accessToken);
  });
});

///////////////////// Logout /////////////////////
router.delete('/logout', authToken, async (req, res) => {
  // only same user should be able log himself Out

  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

///////////////////// Register user /////////////////////
router.post('/', authToken, userLevelCheck(2), async (req, res) => {
  // return res.json(req.body);
  try {
    const existingUser = await Users.findUnique({
      where: {
        Id: req.body.Id,
      },
    });
    if (existingUser) return res.status(500).send('User already exists.');

    // Validate Body
    // Hash tha Pass
    const hashedPass = await bcrypt.hash(req.body.Id, 10);
    const user = await Users.create({
      data: {
        Id: req.body.Id,
        ProvinceId: parseInt(req.body.Provinces.Id),
        LOVDepartmentsId: parseInt(req.body.LOVDepartments.Id),
        UserLevelId: parseInt(req.body.LOVUserLevels.Id),
        Name: req.body.Name,
        Family: req.body.Family,
        PhoneNumber: req.body.PhoneNumber,
      },
    });
    res.json(user);
    await AddLog(req.user.Id, req.body, 'مدیریت کاربران / تثبیت', user, 4);
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

///////////////////// Update users /////////////////////
router.post('/:Id', authToken, userLevelCheck(2), async (req, res) => {
  // return res.json(req.body);
  try {
    const existingUser = await Users.findUnique({
      where: {
        Id: req.params.Id,
      },
    });
    if (!existingUser) return res.status(500).send("User doesn't exist.");
    if (req.user.UserLevelId < 3) {
      const user = await Users.update({
        data: {
          ProvinceId: parseInt(req.body.Provinces.Id),
          LOVDepartmentId: parseInt(req.body.LOVDepartments.Id),
          UserLevelId: parseInt(req.body.LOVUserLevels.Id),
          Name: req.body.Name,
          Family: req.body.Family,
          PhoneNumber: req.body.PhoneNumber,
        },
        where: {
          Id: req.params.Id,
        },
      });
      res.json(user);
      await AddLog(req.user.Id, req.body, 'مدیریت کاربران / ویرایش', user, 6);
    } else {
      return res.status(401).send('خطا: عدم مجوز ویرایش ');
    }
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

///////////////////// Change password /////////////////////
router.post('/:Id/updatePassword', authToken, async (req, res) => {
  // return res.json(req.body);
  try {
    const existingUser = await Users.findUnique({
      where: {
        Id: req.params.Id,
      },
    });
    console.warn(req.body.Id);
    if (!existingUser) return res.status(500).send("User doesn't exist.");
    if (existingUser.Id != req.params.Id)
      return res.status(500).send("You can't change someone else's password.");
    const hashedPass = await bcrypt.hash(req.body.Password, 10);
    const user = await Users.update({
      data: {
        Password: hashedPass,
      },
      where: {
        Id: req.params.Id,
      },
    });
    res.json(user);
    await AddLog(
      req.user.Id,
      req.body,
      'مدیریت کاربران / تغییر رمز عبور',
      user,
      3
    );
  } catch (error) {
    const message = error.message; //?.replace(/(.*\n)*\n*([^\s].*)\n*/, `$2`);
    console.log(message);
    res.status(400).send({ error, message });
  }
});

///////////////////// Delete user/////////////////////
router.delete('/:Id', authToken, userLevelCheck(2), async (req, res) => {
  try {
    await Users.delete({
      where: {
        Id: req.params.Id,
      },
    });
    res.sendStatus(204);
    await AddLog(
      req.user.Id,
      req.body,
      'مدیریت کاربران / حذف',
      { Id: req.params.Id },
      5
    );
  } catch (error) {
    const message = error.message;
    res.status(400).send(message);
  }
});

module.exports = router;
