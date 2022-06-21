import React, { useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import _ from 'lodash';

export const CSVComponent = ({
  getAllRecords,
  formTitle,
  colDefs,
  DataHandler,
}) => {
  const [transactionData, setTransactionData] = useState([]);
  const ColumnNames = {};
  for (const key of Object.keys(colDefs)) {
    ColumnNames[colDefs[key].field] = colDefs[key].headerName;
  }
  const csvLink = useRef(); // هدف اجرای کلیک مخفی روی
  // csvLink
  // است برای زمانیکه داده ها با شرایط فیلتر و ترتیب آماده باشد.
  const getTransactionData = async () => {
    // 'api' just wraps axios with some setting specific to our app. the important thing here is that we use .then to capture the table response data, update the state, and then once we exit that operation we're going to click on the csv download link using the ref
    if (getAllRecords) {
      try {
        const allRecords = await getAllRecords();
        allRecords = DataHandler(allRecords);
        setTransactionData(allRecords);
        csvLink.current.link.click();
      } catch (err) {
        toast.error(`.داده‌ای جهت دانلود موجود نیست`);
      }
    }
  };

  const processData = (ds) => {
    const processedData = [];
    for (let i = 0; i < ds.length; i++) {
      const element = ds[i];
      var newElement = {};
      for (const key of Object.keys(element)) {
        if (typeof element[key] != 'object' && ColumnNames[key])
          if (!element[key]?.toString()?.includes('ndefined'))
            newElement[ColumnNames[key]] = element[key];
          else newElement[ColumnNames[key]] = '';
      }
      processedData.push(newElement);
    }
    return processedData;
  };

  return (
    <div className='relative flex items-center text-xs text-center'>
      <button
        Title='دانلود فایل csv'
        onClick={getTransactionData}
        className={`hidden md:flex transition-all p-[0.2rem] items-center justify-center text-right rounded-t cursor-pointer mr-1 hover:bg-blue-300 text-black text-xs bg-gray-100`}
      >
        <FontAwesomeIcon icon={faFileDownload} className='h-[1.4rem]' />
      </button>
      <CSVLink
        ref={csvLink}
        className='hidden'
        data={processData(transactionData)}
        filename={formTitle}
        target='_blank'
        separator={','}
        enclosingCharacter={' '}
        dir='ltr'
      ></CSVLink>
    </div>
  );
};
