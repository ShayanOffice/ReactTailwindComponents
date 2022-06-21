import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faFilter,
  faSortAlphaDown,
  faSortAlphaUp,
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import Pagination from './Pagination';
import useWhereClauses from '../hooks/useWhereClauses';
import _ from 'lodash';

export const DataGrid = ({
  data,
  TotalItemsCount,
  colDefs,
  postFilterParams,
  modelName,
  postSortParams,
  pageCount,
  setPageNum,
  itemsPerPage,
}) => {
  const [filterParams, setFilterParams] = useState({
    Identity: modelName,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRow, setSelectedRow] = useState(-1);
  const [currentPage, setCurrentPage] = useState(0);
  const [sort, setSort] = useState({});
  useEffect(() => {
    postSortParams &&
      postSortParams({
        Identity: modelName,
        Sort: sort,
      });
  }, [sort]);

  if (!data || data === {}) return <div></div>;
  const ColumnNames = {};
  for (const key of Object.keys(colDefs)) {
    ColumnNames[colDefs[key].field] = colDefs[key].headerName;
  }

  const submitFilter = async (e) => {
    e?.preventDefault();
    try {
      setCurrentPage(0);
      let req = _.cloneDeep(filterParams);
      // مرور بر ستونهای فیلتر و جایگزینی قالب جستجوی
      // Prisma.
      for (let i = 0; i < Object.keys(filterParams).length; i++) {
        const key = Object.keys(filterParams)[i];
        if (
          key !== 'Identity' && // استثنای شناسه
          filterParams[key] && // استثنای ستون بدون فیلتر
          filterParams[key] !== '' // استثنای ستون پاک شده ار فیلتر
        ) {
          req[key] = useWhereClauses(
            filterParams[key], // مقدار فیلتر ستون
            Object.keys(filterParams)[i] // مسبر فیلتر در مدل پایگاه داده ای
          )[key];
        }
      }
      req['Identity'] = modelName; // اضافه کردن شناسه فیلتر که مربوط به کدام مدل است
      req && postFilterParams && (await postFilterParams(req));
    } catch (err) {
      toast.error(`.فیلتراعمال نمیشود${err}`);
    }
  };

  function sortIcon(dir) {
    switch (dir) {
      case 'asc':
        return faSortAlphaDown;
      case 'desc':
        return faSortAlphaUp;
    }
  }

  return (
    <div className='relative w-full mt-2 text-xs'>
      <div className='flex flex-row'>
        <button
          className={`hidden md:flex transition-all  p-[0.2rem] items-center justify-center  text-right rounded-t cursor-pointer -top-[0.8rem] right-16 mr-1 hover:bg-blue-300 w-fit text-xs ${
            showFilters
              ? 'bg-blue-200 shadow-md text-blue-700'
              : 'bg-gray-100 text-black'
          }`}
          dir='ltr'
          onClick={() =>
            setShowFilters((prev) => {
              if (prev == true)
                setFilterParams({
                  Identity: modelName,
                });
              return !prev;
            })
          }
        >
          <FontAwesomeIcon
            icon={faFilter}
            className={`transition-all mx-2 opacity-80 hover:opacity-100 h-3 w-3`}
          />
          فیلتر
        </button>
      </div>
      <div className='hidden md:inline'>
        <table
          style={{ borderSpacing: '0 6px', marginTop: '-6px' }}
          className='w-full text-center border border-separate'
        >
          <thead
            className='bg-white text-xs  lg:text-sm 
                            drop-shadow-[2px_0_1px_rgba(29,38,109,0.3)]  transition-all 
                            hover:drop-shadow-[0_2px_1px_rgba(29,38,109,0.3)] '
          >
            <tr>
              <td className='hidden lg:table-cell'>
                <p className='relative'>ردیف</p>
              </td>
              {colDefs.map(
                (def, index) =>
                  !def.HideInRespTab &&
                  def && (
                    <td
                      key={index}
                      className={`${
                        sort[def.field] == 'asc'
                          ? 'bg-blue-200 hover:bg-blue-300'
                          : sort[def.field] == 'desc'
                          ? 'bg-blue-400 hover:bg-blue-500'
                          : 'hover:bg-blue-100'
                      } `}
                      onClick={async () => {
                        !def.nonFilterable &&
                          setSort((prev) => {
                            const obj = {
                              ...prev,
                              [def.field]:
                                prev[def.field] == 'undefined'
                                  ? 'asc'
                                  : prev[def.field] == 'asc'
                                  ? 'desc'
                                  : prev[def.field] == 'desc'
                                  ? ''
                                  : 'asc',
                            };
                            for (let i = 0; i < Object.keys(obj).length; i++) {
                              const key = Object.keys(obj)[i];
                              if (obj[key] == '') delete obj[key];
                            }

                            return obj;
                          });
                      }}
                    >
                      <p className='relative cursor-pointer'>
                        {def.headerName}
                        {!def.nonFilterable &&
                          sort[def.field] &&
                          sort[def.field] != '' && (
                            <FontAwesomeIcon
                              className={`absolute transition-all -mr-[0.1rem] opacity-50 hover:opacity-100 h-3 w-3 top-1 `}
                              icon={sortIcon(sort[def.field])}
                            />
                          )}
                      </p>
                    </td>
                  )
              )}
            </tr>
            {showFilters && (
              <tr>
                <td className='hidden lg:flex '>
                  <button
                    title='اعمال فیلتر'
                    className='p-[0.2rem] hover:bg-blue-400 rounded transition-all'
                    onClick={(e) => {
                      submitFilter(e);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBolt}
                      className={`transition-all mx-2 opacity-80 hover:opacity-100 h-4 w-4`}
                    />
                  </button>
                </td>
                {colDefs.map(
                  (def, index) =>
                    !def.HideInRespTab &&
                    def && (
                      <td key={index}>
                        <form onSubmit={submitFilter}>
                          <input
                            title={def.field}
                            placeholder={def.headerName}
                            onChange={(e) => {
                              setFilterParams((prev) => ({
                                ...prev,
                                [def.field]: e.target.value,
                              }));
                            }}
                            className={`w-full max-w-md text-xs px-0.5 py-[0.07rem] text-gray-700 rounded appearance-none focus:outline-none focus:shadow-outline ${
                              def.nonFilterable && 'hidden'
                            }`}
                            type='text'
                            value={filterParams[[def.field]]}
                          />
                        </form>
                      </td>
                    )
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => setSelectedRow(index)}
                className={`text-xs lg:text-[0.85rem] odd:bg-[#aac5ff33] hover:bg-[#a4c1fd]  even:bg-[#f3f3f505] transition-all rounded ${
                  index == selectedRow && 'ring-2 ring-blue-400'
                }`}
              >
                {/* -----------------------نمایش اطلاعات هر سطر(شماره ردیف----------------------- */}
                <td
                  className={`hidden lg:table-cell w-10 p-0.5 py-3 first-of-type:border-r-0 last-of-type:border-l-0 border-t-0  first-of-type:rounded-r-[0.2rem] last-of-type:rounded-l-[0.2rem] border-l-4 border-l-blue-300 bg-blue-200`}
                >
                  {itemsPerPage
                    ? currentPage * itemsPerPage + index + 1
                    : index + 1}
                </td>
                {/* ----------------------------نمایش اطلاعات هر سطر---------------------------- */}
                {colDefs.map(
                  (def, ind) =>
                    !def.HideInRespTab &&
                    def && (
                      <td
                        className={`${def.className} max-w-0 lg:max-w-max py-3 first-of-type:border-r-0 last-of-type:border-l-0 border-t-0  first-of-type:rounded-r-[0.2rem] border-l-2 border-l-[#eedfff45] last-of-type:rounded-l-[0.2rem]`}
                        key={ind}
                      >
                        {!row[def.field]?.toString()?.includes('ndefined') &&
                          row[def.field]}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}

      <div className='flex justify-center w-full mx-auto my-1 text-lg font-bold text-center md:hidden'>
        {/* 'build MobileTable for screens less than md:768px,' */}
        <div className='w-[90%] mt-3'>
          <div className='flex justify-around w-full pb-2 mb-3 text-[0.6rem] leading-3 border-b-4 shadow-sm border-slate-300'>
            {/* Mobile Accordion Headings */}
            <h4> ردیف:</h4>
            {colDefs.map(
              (def, ind) =>
                def.mobileHeader &&
                !def.HideInRespTab && <h4 key={ind}>{def.headerName}: </h4>
            )}
            {/* <div className='invisible'>........</div> */}
            {/*  because "flex + justify between" should have atleast 2 html elements to become effective.*/}
          </div>

          {data.map((row, index) => (
            <details className='w-full mb-4 marker:none' key={index}>
              <summary
                id={`panel${index}`}
                className='list-none marker:text-sky-400'
              >
                <span
                  className={`flex flex-row justify-between text-[0.6rem] leading-3 shadow-md border-b-4 border-blue-300`}
                >
                  {/* eachMobileHeader */}
                  <p className={`w-full m-1`}>
                    {itemsPerPage
                      ? currentPage * itemsPerPage + index + 1
                      : index + 1}
                  </p>
                  {colDefs.map(
                    (def, ix) =>
                      def.mobileHeader && (
                        <p
                          key={ix}
                          className={`w-full m-1 ${
                            def.className && def.className
                          }`}
                        >
                          {row[def.field]}
                        </p>
                      )
                  )}
                </span>
              </summary>
              <div className='flex flex-col items-center justify-center w-full px-3 text-[10px]'>
                {/* eachMobileRow */}
                {colDefs.map(
                  (def, ind) =>
                    !def.mobileHeader && (
                      <span
                        key={ind}
                        className='flex items-center justify-between w-full p-0 text-[0.6rem] leading-3 '
                      >
                        <div
                          className={` md:${
                            def.className && def.className
                          } w-full flex items-center justify-between border-b-2 border-solid border-blue-200`}
                        >
                          <span>{def.headerName}:</span>
                          <span>{row[def.field]}</span>
                        </div>
                      </span>
                    )
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
      {itemsPerPage && (
        <Pagination
          totalPages={pageCount}
          forcePage={currentPage}
          goToPage={async (p) => {
            setPageNum && setPageNum(p);
            setCurrentPage(p - 1);
          }}
        />
      )}
      {itemsPerPage && (
        <span className='flex items-center justify-center w-full'>
          {`تعداد کل: ${TotalItemsCount}`}
        </span>
      )}
    </div>
  );
};
