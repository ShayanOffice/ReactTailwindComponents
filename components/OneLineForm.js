import React, { useEffect, useState } from 'react';
import Combo from './Combo';
import UpDownNumber from './UpDownNumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import produce from 'immer';
import Validator from './Validator';

export default function OneLineForm(props) {
  const [dataState, setDataState] = useState({
    ...props.value,
  });

  useEffect(() => {
    // props.validations.concat(validations);
    props.onChange && props.onChange(dataState);
  }, [dataState]);

  const formsView = () =>
    props.colDef.map((item, ix) => {
      if (!item.hideInForms) {
        switch (item.type) {
          case 'text':
            return (
              <Validator
                key={ix}
                show={props.pressedSubmitOnce}
                validations={props.validations}
              >
                <div key={ix} className={` ${item.className} mx-1`}>
                  {item.headerName && (
                    <label
                      className={`block mb-2 text-sm font-bold text-gray-700 `}
                      htmlFor={item.field}
                    >
                      {item.headerName + ':'}
                    </label>
                  )}
                  <input
                    onChange={(e) => {
                      setDataState((prev) =>
                        produce(prev, (newer) => {
                          newer[item.field] = e.target.value;
                        })
                      );
                    }}
                    className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                    id={item.field}
                    type={item.type} /* e.g. text */
                    rules={item.rules}
                    value={dataState[item.field]}
                    // placeholder={
                    //   props.value == {} ? '' : props.value[item.field]
                    // }
                  />
                </div>
              </Validator>
            );
          case 'select': {
            var getOptions = () => {
              const choises = item.choises;
              return choises
                ? choises.map((choise) => {
                    const id = choise[item.optionSource.replace(/.*\./, '')];
                    const val = item.optionTitle.reduce(
                      (title, txt) =>
                        /:/.test(txt)
                          ? choise[txt.replace(/[^a-zA-Z]/g, '')] &&
                            title +
                              txt.replace(/[a-zA-Z]/g, '') +
                              choise[txt.replace(/[^a-zA-Z]/g, '')]
                          : title + ' ' + choise[txt],
                      ''
                    );
                    return {
                      id,
                      val,
                    };
                  })
                : [];
            };
            return (
              <Validator
                key={ix}
                show={props.pressedSubmitOnce}
                validations={props.validations}
              >
                <div
                  className={`flex items-baseline justify-center w-full text-center ${item.className}`}
                >
                  {item.headerName && (
                    <label
                      className='flex justify-start w-1/3 mb-2 mr-8 text-sm font-bold text-right text-gray-700'
                      htmlFor={item.field}
                    >
                      {item.headerName + ':'}
                    </label>
                  )}
                  <div className='flex justify-end w-full'>
                    <Combo
                      field={item.field}
                      onChange={(value) => {
                        setDataState((prev) =>
                          optionSourceSetter(item, prev, value)
                        );
                      }}
                      value={
                        dataState && dataState != {}
                          ? optionSourceGetter(item, dataState)
                          : -1
                      }
                      optionsList={getOptions()}
                      rules={item.rules}
                    />
                  </div>
                </div>
              </Validator>
            );
          }
          case 'count':
            console.log('OneLineState: ', dataState);
            return (
              <div key={ix} className={` ${item.className} mx-1`}>
                {item.headerName && (
                  <label
                    className={`block mb-2 text-sm font-bold text-gray-700 `}
                    htmlFor={item.field}
                  >
                    {item.headerName + ':'}
                  </label>
                )}
                <UpDownNumber
                  value={dataState.Count}
                  maxVal={8}
                  minVal={0}
                  step={1}
                  hideError
                  message=''
                  onChange={(value) =>
                    setDataState((prev) =>
                      produce(prev, (newer) => {
                        newer.Count = value;
                      })
                    )
                  }
                />
              </div>
            );
        }
      }
    });

  return (
    // <div className='flex justify-center w-full'>
    <form className={`w-full px-8 bg-white flex justify-center items-center`}>
      {formsView()}
      {
        <span
          className='flex items-center justify-center h-full transition-all opacity-50 cursor-pointer hover:opacity-100'
          onClick={() => props.onDelete && props.onDelete()}
        >
          <FontAwesomeIcon
            icon={faCircleMinus}
            className={`h-full w-4 m-auto`}
          />
        </span>
      }
    </form>
  );
}

function optionSourceSetter(colDefItem, previousData, valueToSet) {
  var obj;
  if (/\./.test(colDefItem.optionSource)) {
    // obj = produce(previousData, (newer) => {
    //   eval('newer.' + colDefItem.optionSource.replace(/(.*)(\.).*/, '$1'))[
    //     colDefItem.optionSource.replace(/.*\./, '')
    //   ] = valueToSet;
    // });
    obj = produce(previousData, (newer) => {
      if (!newer) newer = {};
      const path = colDefItem.optionSource;
      const pathArr = path.split('.');
      const finalNestedProp = pathArr.pop();
      if (finalNestedProp) {
        newer = pathArr.reduce((lastPos, prop) => {
          if (!lastPos[prop]) lastPos[prop] = {};
          return lastPos[prop];
        }, newer);
        newer[finalNestedProp] = valueToSet;
      }
    });
  } else {
    obj = produce(previousData, (newer) => {
      newer[colDefItem.optionSource] = valueToSet;
    });
  }
  return obj;
}

function optionSourceGetter(colDefItem, dataState) {
  const evaled = eval(
    'dataState.' + colDefItem.optionSource.replace(/(.*)(\.).*/, '$1')
  );

  return /\./.test(colDefItem.optionSource)
    ? evaled
      ? evaled[colDefItem.optionSource.replace(/.*\./, '')]
      : null
    : dataState[colDefItem.optionSource];
}
