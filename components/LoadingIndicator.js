export default function LoadingIndicator(props) {
  return (
    <div
      dir='rtl'
      className={`transition-opacity duration-0 bg-[#ffffffaa] pointer-events-none fixed z-[100] opacity-100 text-yellow-50 h-screen w-screen flex flex-col justify-center items-center ${
        !props.show && 'opacity-0'
      }`}
    >
      <img
        src='images/Spinner.svg'
        className='object-cover w-1/4 h-1/4 animate-pulse opacity-70'
      />
      <span className='font-extrabold text-center drop-shadow-lg animate-pulse text-slate-500'>
        لطفا کمی صبر کنید
      </span>
    </div>
  );
}
