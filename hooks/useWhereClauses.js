import _ from 'lodash';
const pathsToWhere = {
  //   Connections: {
  //     some: {
  //       OR: [
  //         {
  //           LOVConnections: {
  //             Type: {
  //               contains: 'searchInput',
  //             },
  //           },
  //         },
  //         {
  //           Ip: {
  //             contains: 'searchInput',
  //           },
  //         },
  //         {
  //           NetworkName: {
  //             contains: 'searchInput',
  //           },
  //         },
  //       ],
  //     },
  //   },
  // };
  OSes: [`some.LOVOSes.Specs.contains`],
  Softwares: [`some.LOVSoftwares.Specs.contains`],
  Apps: [`some.LOVApps.Name.contains`],
  Memories: [
    `some.OR[0].LOVMemories.Capacity.contains`,
    `some.OR[1].LOVMemories.Type.contains`,
    // `some.Count.contains`,
  ],
  Storages: [
    `some.OR[0].LOVStorages.Specs.contains`,
    `some.OR[1].LOVStorages.Type.contains`,
    // `some.Count.contains`,
  ],
  Connections: [
    `some.OR[0].LOVConnections.Type.contains`,
    `some.OR[1].Ip.contains`,
    `some.OR[2].NetworkName.contains`,
  ],
};

export default function useWhereClauses(searchInput, Model = '') {
  if (Model == '' || searchInput == '')
    return console.error(
      'Where clause can not be generated without parameters.'
    );

  var where = {};
  var PathsPlusModel;
  if (pathsToWhere[Model]) {
    PathsPlusModel = pathsToWhere[Model].map((path, i) => Model + '.' + path);
    PathsPlusModel.forEach((path) => {
      where = _.set(where, path, searchInput);
    });
    return where;
  }
  // if where clause wasn't defined return simple path for the backend to generate the where clause using the simpler way.
  return { [Model]: searchInput };
}
