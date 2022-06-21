
Invalid `Monitors.findMany()` invocation in
C:\PersonalFiles\Projects\Code\Sama2\Sama2-Backend\routes\monitors.js:59:35

   56   pageNum,
   57   pageItems
   58 );
→  59 const itms = await Monitors.findMany({
        select: {
          Id: true,
          PropertyCode: true,
          LOVMonitors: {
            select: {
              Id: true,
              Model: true,
              Specs: true
            }
          },
          Users: {
            select: {
              Id: true,
              Name: true,
              Family: true
            }
          },
          Provinces: {
            select: {
              Id: true,
              Province: true
            }
          },
          LOVDepartments: {
            select: {
              Id: true,
              Department: true
            }
          }
        },
        take: '10',
              ~~~~
        skip: 0,
        where: {},
        orderBy: [
          {
            Id: 'asc'
          }
        ]
      })

Argument take: Got invalid value '10' on prisma.findManyMonitors. Provided String, expected Int.

