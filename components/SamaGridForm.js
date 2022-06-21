import { startTransition, useEffect, useState } from 'react';
import PopupWrapper from './PopupWrapper';
import PrepareForm from './PrepareForm';
import { DataGrid } from './DataGrid';
import SamaButton from './SamaButton';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useCleanFilterMutation } from '../app/RTKapi';
import { CSVComponent } from './CSVComponent';

export function SamaGridForm(props) {
  const {
    addActionName,
    addDialogTitle,
    edtActionName,
    colDefs,
    insertReq,
    editReq,
    removeReq,
    edtDialogTitle,
    postFilterParamsReq,
    postSortParamsReq,
    modelName,
    formTitle,
    forcedFormValues,
    TotalItemsCount,
    itemsPerPage,
    pageCount,
    rmvActionName,
    rmvDialogTitle,
    List,
    setPageNum,
    getAllRecordsReq,
    DataHandler,
  } = props;

  useCleanFilterMutation(); // جهت پاک کردن فیلتر
  const userProfile = useSelector((state) => state.userReducer.currentUser);
  const router = useRouter();

  // eval('itm.' + ozv.replace(/(.*)\..*/, '$1'))[ozv.replace(/.*\.(.*)/, '$1')]



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
      />
      <DataGrid
        colDefs={colDefs}
        postFilterParams={postFilterParams}
        postSortParams={postSortParams}
        setPageNum={setPageNum}
        data={handleRowData(List)}
        modelName={modelName}
        pageCount={pageCount}
        TotalItemsCount={TotalItemsCount}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
