import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.SqlUrl + 'api/' /* defined in next.config.js */,
  //process.env.NODE_ENV === 'production' ? `http://localhost:5000/`, : 'http://w.x.y.z:5000/',
  credentials: 'include',
  prepareHeaders: (headers) => {
    return headers;
  },
});

// Define a service using a base URL and expected endpoints
export const RTKapi = createApi({
  reducerPath: 'RTKapi',
  baseQuery: baseQuery,
  tagTypes: ['Monitor'],

  endpoints: (builder) => ({
    //    getXyz: builder.query({ query: (qry) => ({ url: `Certificate...?`,}), providesTags: ['Certificates'], }),
    //    xyz: builder.mutation({ query: (body) => ({ url: `Invitation-SetStatus`, method: 'POST', body, }), invalidatesTags: ['Certificates'],}),

    // --------- Monitor APIs ---------
    getLOVMonitors: builder.query({
      query: () => ({ url: `lov/monitors`, method: 'get' }),
      providesTags: ['Monitor'],
    }),
    addLOVMonitor: builder.mutation({
      query: (body) => ({ url: `lov/monitors`, method: 'POST', body }),
      invalidatesTags: ['Monitor'],
    }),
    edtLOVMonitor: builder.mutation({
      query: (body) => ({
        url: `lov/monitors/${body.Id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Monitor'],
    }),
    rmvLOVMonitor: builder.mutation({
      query: (body) => ({
        url: `lov/monitors/${body.Id}`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Monitor'],
    }),
    // // // // // // // // // // // // \\ \\ \\ \\ \\ \\ \\ \\ \\ \\
    getAllMonitors: builder.mutation({
      query: () => ({ url: `monitors/`, method: 'get' }),
    }),
    getMonitors: builder.query({
      query: ({ itemsPerPage, pageNum }) => ({
        url: `monitors/pageItems:${itemsPerPage}&pageNum:${pageNum}`,
        method: 'get',
      }),
      providesTags: ['Monitor'],
    }),
    addMonitor: builder.mutation({
      query: (body) => ({ url: `monitors`, method: 'POST', body }),
      invalidatesTags: ['Monitor'],
    }),
    edtMonitor: builder.mutation({
      query: (body) => ({ url: `monitors/${body.Id}`, method: 'POST', body }),
      invalidatesTags: ['Monitor'],
    }),
    rmvMonitor: builder.mutation({
      query: (body) => ({ url: `monitors/${body.Id}`, method: 'DELETE', body }),
      invalidatesTags: ['Monitor'],
    }),
    // --------- Monitor APIs ---------

    // ---------- Filter APIs ----------
    cleanFilter: builder.mutation({
      query: () => ({ url: `filters`, method: 'get' }),
      invalidatesTags: ['Monitor'],
    }),
    postNewFilter: builder.mutation({
      query: (body) => ({ url: `filters`, method: 'post', body }),
      invalidatesTags: ['Monitor'],
    }),
    // --------- Filter APIs ---------

    // ---------- Sort APIs ----------
    clearSort: builder.mutation({
      query: () => ({ url: `sort`, method: 'get' }),
      invalidatesTags: ['Monitor'],
    }),
    postSort: builder.mutation({
      query: (body) => ({ url: `sort`, method: 'post', body }),
      invalidatesTags: ['Monitor'],
    }),
    // ---------- Sort APIs ----------
  }),
});

export const {
  // hooks for usage in functional components

  // --- Laptop api hooks ---
  useGetLOVAppsQuery,
  useAddAppMutation,
  useEdtAppMutation,
  useRmvAppMutation,

  // --- Computer api hooks ---
  useGetAllComputersMutation,
  useGetComputersQuery,
  useAddComputerMutation,
  useEdtComputerMutation,
  useRmvComputerMutation,

  // --- Connection api hooks ---
  useGetLOVConnectionsQuery,
  useAddConnectionMutation,
  useEdtConnectionMutation,
  useRmvConnectionMutation,

  // --- CPU api hooks ---
  useGetLOVCPUsQuery,
  useAddCPUMutation,
  useEdtCPUMutation,
  useRmvCPUMutation,

  // --- Department api hooks ---
  useGetLOVDepartmentsQuery,
  useAddDepartmentMutation,
  useEdtDepartmentMutation,
  useRmvDepartmentMutation,

  // --- Filter api hooks ---
  useCleanFilterMutation,
  usePostNewFilterMutation,

  // --- Paging api hooks ---

  // --- GPU api hooks ---
  useGetLOVGPUsQuery,
  useAddGPUMutation,
  useEdtGPUMutation,
  useRmvGPUMutation,

  // --- Laptop api hooks ---
  useGetLOVLaptopsQuery,
  useAddLaptopMutation,
  useEdtLaptopMutation,
  useRmvLaptopMutation,

  // --- Log api hooks ---
  useGetAllLogMutation,
  useGetLogQuery,

  // --- Memory api hooks ---
  useGetLOVMemoriesQuery,
  useAddMemoryMutation,
  useEdtMemoryMutation,
  useRmvMemoryMutation,

  // --- Monitor api hooks ---
  useGetLOVMonitorsQuery,
  useAddLOVMonitorMutation,
  useEdtLOVMonitorMutation,
  useRmvLOVMonitorMutation,
  //\\//\\//\\//\\//\\//\\//\\
  useGetAllMonitorsMutation,
  useGetMonitorsQuery,
  useAddMonitorMutation,
  useEdtMonitorMutation,
  useRmvMonitorMutation,
  // --- Motherboard api hooks ---
  useGetLOVMotherBoardsQuery,
  useAddMotherbordMutation,
  useEdtMotherbordMutation,
  useRmvMotherbordMutation,

  // --- Power api hooks ---
  useGetLOVOperationsQuery,
  useAddOperationMutation,
  useEdtOperationMutation,
  useRmvOperationMutation,

  // --- Os api hooks ---
  useGetLOVOSesQuery,
  useAddOSMutation,
  useEdtOSMutation,
  useRmvOSMutation,

  // --- Power api hooks ---
  useGetLOVPowersQuery,
  useAddPowerMutation,
  useEdtPowerMutation,
  useRmvPowerMutation,

  // --- Province api hooks ---
  useGetProvincesQuery,
  useAddProvinceMutation,
  useEdtProvinceMutation,
  useRmvProvinceMutation,

  // --- Printer api hooks ---
  useGetLOVPrintersQuery,
  useAddLOVPrinterMutation,
  useEdtLOVPrinterMutation,
  useRmvLOVPrinterMutation,
  //\\//\\//\\//\\//\\//\\//\\
  useGetAllPrintersMutation,
  useGetPrintersQuery,
  useAddPrinterMutation,
  useEdtPrinterMutation,
  useRmvPrinterMutation,
  // --- Scanner api hooks ---
  useGetLOVScannersQuery,
  useAddLOVScannerMutation,
  useEdtLOVScannerMutation,
  useRmvLOVScannerMutation,
  //\\//\\//\\//\\//\\//\\//\\
  useGetAllScannersMutation,
  useGetScannersQuery,
  useAddScannerMutation,
  useEdtScannerMutation,
  useRmvScannerMutation,

  // --- Software api hooks ---
  useGetLOVSoftwaresQuery,
  useAddSoftwareMutation,
  useEdtSoftwareMutation,
  useRmvSoftwareMutation,

  // --- Sort api hooks ---
  useClearSortMutation,
  usePostSortMutation,

  // --- Storage api hooks ---
  useGetLOVStoragesQuery,
  useAddStorageMutation,
  useEdtStorageMutation,
  useRmvStorageMutation,

  // --- Telephone api hooks ---
  useGetLOVTelephonesQuery,
  useAddLOVTelephoneMutation,
  useEdtLOVTelephoneMutation,
  useRmvLOVTelephoneMutation,
  //\\//\\//\\//\\//\\//\\//\\
  useGetAllTelephonesMutation,
  useGetTelephonesQuery,
  useAddTelephoneMutation,
  useEdtTelephoneMutation,
  useRmvTelephoneMutation,

  // --- UserLevel api hooks ---
  useGetLOVUserLevelsQuery,
  useAddUserLevelMutation,
  useEdtUserLevelMutation,
  useRmvUserLevelMutation,

  // --- User api hooks ---
  useGetAllUsersMutation,
  useChngUsrPswrdMutation,
  useEdtUserMutation,
  useGetUserProfileQuery,
  useGetUsersQuery,
  useLoginUserMutation,
  useLogoutUserMutation,
  useRegisterMutation,
  useRmvUserMutation,
} = RTKapi;
