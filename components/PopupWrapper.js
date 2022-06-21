import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function PopupWrapper(props) {
  /* This example requires Tailwind CSS v2.0+ */
  var { children, DialogTitle, setShowDialog, showDialog, small } = props;

  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={showDialog ? true : false} as={Fragment}>
      <Dialog
        as='div'
        className='fixed inset-0 z-10 overflow-y-auto '
        initialFocus={cancelButtonRef}
        onClose={(x) => {
          setShowDialog(x);
        }}
      >
        <div className='flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div
              className={`relative inline-block text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle ${
                small ? 'max-w-sm' : 'max-w-4xl'
              } sm:w-full`}
            >
              <div className='px-4 pt-5 pb-4 bg-white MainDialog sm:p-6 sm:pb-4 rounded-2xl'>
                <div className='w-full sm:flex sm:items-start'>
                  <div
                    dir='rtl'
                    className='justify-start w-full mt-1 text-right sm:mt-0 sm:ml-4 sm:text-right'
                  >
                    <div className='flex items-center w-full border-b-2'>
                      <button
                        type='button'
                        className='inline-flex justify-center w-full px-2 py-2 my-3 text-base text-gray-700 bg-white border-2 border-indigo-500 rounded-md shadow-sm hover:bg-gray-50 ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                        onClick={() => {
                          setShowDialog(false);
                        }}
                        ref={cancelButtonRef}
                      >
                        <img
                          src='/images/close.png'
                          width='18rem'
                          className='object-cover'
                        />
                      </button>
                      <Dialog.Title
                        as='h3'
                        className='mb-4 text-lg font-extrabold text-gray-900'
                      >
                        {DialogTitle}
                      </Dialog.Title>
                    </div>

                    <div className='w-full'>
                      <p>{children}</p>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
