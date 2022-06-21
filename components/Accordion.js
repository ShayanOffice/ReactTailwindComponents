import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleChevronDown,
  faCirclePlus,
} from '@fortawesome/free-solid-svg-icons';

import React, { useState } from 'react';

export default function Accordion(props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`transition-all duration-75 w-full mt-0 overflow-visible  ${
        isOpen ? 'h-fit' : 'h-10'
      }`}
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className='z-10 flex items-center justify-between w-full h-10 bg-white border-2 border-gray-300 rounded cursor-pointer'
      >
        <div className='flex items-center justify-between h-full'>
          <FontAwesomeIcon
            icon={faCircleChevronDown}
            className={`transition-all duration-75 mx-2 opacity-50 hover:opacity-100 h-3/6 ${
              isOpen && 'rotate-[180deg]'
            }`}
          />
          <span>{props.Title ? props.Title : 'بدون عنوان'}</span>
        </div>
        <span
          className='flex items-center justify-between h-full transition-all opacity-50 hover:opacity-100'
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            props.addAction();
          }}
        >
          <FontAwesomeIcon
            icon={faCirclePlus}
            className={`transition-all duration-75 mx-2  h-3/6 `}
          />
        </span>
      </div>
      <div
        className={`transition-all origin-top duration-75 w-full h-full bg-white rounded border-slate-400 border-2 
        ${isOpen ? 'h-100' : 'h-0 hidden'}
        `}
      >
        <div
          className={`transition-all duration-75  py-1 px-6
          ${isOpen ? 'opacity-100' : 'opacity-0 hidden'}`}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
