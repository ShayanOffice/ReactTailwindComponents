import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function SamaButton(props) {
  const { btnText, txtColor, bgColor, btnClick, ikon } = props;
  const textColor = txtColor ? txtColor : 'black';
  return (
    <button
      Title='افزودن'
      className={`transition-all w-[2.570rem] h-10  m-1 text-xs font-semibold text-[${txtColor}] flex justify-center items-center hover:bg-blue-400 rounded-full`}
      onClick={() => btnClick && btnClick()}
    >
      <div className='flex justify-center row-auto'>
        {ikon && <img className='w-5 h-5 mx-2 rounded-sx' src={ikon} alt='' />}
        {/* <FontAwesomeIcon
          icon={faPlus}
          className={`transition-all mx-2 opacity-80 hover:opacity-100 h-3 w-3`}
        /> */}
        {/* {btnText} */}
      </div>
    </button>
  );
}
