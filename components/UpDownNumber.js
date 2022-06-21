import { useEffect, useState } from 'react';

export default function UpDownNumber(props) {
  const [counter, setCounter] = useState(props.value ? props.value : 1);
  useEffect(() => {
    if (props.onChange) props.onChange(counter);
  }, [counter]);
  return (
    <div
      dir='ltr'
      className='relative flex items-center justify-center w-10 border border-gray-300 rounded-md h-fit selection:bg-none'
    >
      <div className='flex flex-col items-center justify-center w-32 font-semibold text-center text-white border-gray-400 rounded-l cursor-pointer bg-slate-500 hover:bg-slate-600 h-7 focus:outline-none'>
        <span
          className=''
          onClick={() =>
            setCounter(Math.max(counter - props.step, props.minVal))
          }
        >
          -
        </span>
      </div>
      <div className='flex items-center justify-center w-24 text-xs bg-white cursor-default h-7 md:text-base'>
        <span>{counter ? counter : 0}</span>
      </div>

      <div className='flex flex-col items-center justify-center w-32 font-semibold text-center text-white border-l border-gray-400 rounded-r cursor-pointer bg-slate-700 hover:bg-slate-600 h-7 focus:outline-none'>
        <span
          className=''
          onClick={() =>
            setCounter(Math.min(counter + props.step, props.maxVal))
          }
        >
          +
        </span>
      </div>

      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col py-1 px-3 items-center justify-center ${
          props.hideError && 'hidden'
        }`}
      >
        <svg width='10' height='10' className='fill-red-500 ml-5 md:mx-auto'>
          <polygon points='0 10, 10 10, 5 0' />
        </svg>
        <span className='text-xs flex justify-center bg-red-500 p-2 h-auto w-24 rounded-lg text-white'>
          {props.message}
        </span>
      </div>
    </div>
  );
}
