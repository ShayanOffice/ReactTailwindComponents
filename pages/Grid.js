import React, { useEffect, useState } from 'react';
import {
  RTKapi,
  useCleanFilterMutation, // برای اعمال فیلتر از سمت back-end //
  useGetLOVMonitorsQuery,
  usePostNewFilterMutation,
  useClearSortMutation,
  usePostSortMutation,
  useGetAllMonitorsMutation,
} from '../app/RTKapi';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../app/systemSlice';
import toast from 'react-hot-toast';
import { CSVComponent } from '../components/CSVComponent';
import { DataGrid } from '../components/DataGrid';

export default function Monitors() {
  const [getMonitorsReq, { data: Response, isLoading }] =
    RTKapi.useLazyGetMonitorsQuery();
  const [pageNum, setPageNum] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(18);

  const dispatch = useDispatch();
  const { data: MonList } = useGetLOVMonitorsQuery();
  const [getAllRecordsReq] = useGetAllMonitorsMutation();
  const [postFilterParamsReq] = usePostNewFilterMutation();
  const [postSortParamsReq] = usePostSortMutation();
  useCleanFilterMutation();

  const [cleanFilters] = useCleanFilterMutation(); // جهت پاک کردن فیلتر
  const [clearSortings] = useClearSortMutation(); // جهت پاک کردن مرتب سازی

  const getAllRecords = async () => {
    var list;
    try {
      getAllRecordsReq && (list = await getAllRecordsReq().unwrap());
      return list;
    } catch (err) {
      toast.error(`.دریافت اطلاعات  با مشکل مواجه شد\n${err}`);
    }
  };
  const postSortParams = async (payload) => {
    try {
      postSortParamsReq && (await postSortParamsReq(payload).unwrap());
    } catch (err) {
      toast.error(`.درخواست مرتب سازی امکان پذیر نیست\n${err}`);
    }
  };
  const postFilterParams = async (payload) => {
    try {
      postFilterParamsReq && (await postFilterParamsReq(payload).unwrap());
    } catch (err) {
      toast.error(`.فیلتراعمال نمیشود${err}`);
    }
  };

  useEffect(() => {
    cleanFilters();
    clearSortings();
  }, []);

  useEffect(() => {
    if (isLoading) dispatch(setIsLoading(true));
    else dispatch(setIsLoading(false));
  }, [isLoading]);

  useEffect(() => {
    getMonitorsReq({ itemsPerPage, pageNum });
  }, [itemsPerPage, pageNum]);

  const colDefs = [
    {
      headerName: 'مدل',
      field: 'LOVMonitors.Model',
      type: 'select',
      className: 'font-sans',
      rules: ['required'],
      //   nonFilterable: true,
    },
    { headerName: 'کد اموال', field: 'PropertyCode' },
    { headerName: 'نام', field: 'Users.Name' },
    { headerName: 'نام خانوادگی', field: 'Users.Family' },
    { headerName: 'استان', field: 'Provinces.Province' },
    { headerName: 'واحد', field: 'LOVDepartments.Department' },
  ];

  const DataHandler = (qry) => {
    if (!qry) return [];
    let rowdata = qry;

    rowdata = rowdata.map((row, ix) => ({
      ...row,
      ix: ix,
      'LOVMonitors.Model': row.LOVMonitors?.Model,
      'Users.Name': row.Users?.Name,
      'Users.Family': row.Users?.Family,
      'Provinces.Province': row.Provinces?.Province,
      'LOVDepartments.Department': row.LOVDepartments?.Department,
    }));
    return rowdata;
  };

  const formTitle = 'مانیتور های تحویل شده';

  return (
    <div
      dir='rtl'
      className='relative flex flex-col items-center justify-center w-full mt-0'
    >
      <CSVComponent
        colDefs={colDefs}
        formTitle={formTitle}
        getAllRecords={getAllRecords}
        DataHandler={DataHandler}
        className='absolute top-0 left-0 z-10 rounded-full'
      />
      <DataGrid
        colDefs={colDefs}
        postFilterParams={postFilterParams}
        postSortParams={postSortParams}
        setPageNum={setPageNum}
        data={Response?.items && DataHandler(Response?.items)}
        modelName='Monitors'
        pageCount={Response?.pageCount}
        TotalItemsCount={Response?.itemsCount}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
