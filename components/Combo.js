import { Fragment, useEffect, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function Combo(props) {
  const { value, optionsList } = props;
  let initialItem = optionsList.filter((itm) => itm.id == value)[0];

  const [chosen, setChosen] = useState(
    initialItem ? initialItem : { id: undefined, val: 'انتخاب کنید' }
  );
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (props.onChange) {
      // console.log(selected, props.onChange);
      props.onChange(chosen.id); // in case of onChange event, perform same in parent record
    }
  }, [chosen]);

  const filteredList =
    query === ''
      ? optionsList
      : optionsList.filter((itm) =>
          itm.val
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div dir='rtl' className='w-full mb-2 '>
      <Combobox value={chosen} onChange={setChosen}>
        <div className='relative mt-1'>
          <div className='relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm'>
            <Combobox.Input
              className='w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0'
              displayValue={(itm) => itm.val}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transition-all duration-[.37s] mx-2 opacity-50 hover:opacity-100 h-[50%]`}
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base text-right bg-gray-200 border-2 rounded-md shadow-lg focus:outline-none max-h-60 ring-1 ring-black ring-opacity-5 sm:text-sm border-x-slate-300 border-b-slate-300'>
              {filteredList.length === 0 && query !== '' ? (
                <div className='relative px-4 py-2 text-gray-700 cursor-default select-none'>
                  یافت نمیشود.
                </div>
              ) : (
                filteredList.map((itm) => {
                  return (
                    <Combobox.Option
                      key={itm.id}
                      className={({ selected, active }) => {
                        if (itm.id == chosen.id) selected = true; // Shayan
                        return `relative cursor-default select-none py-2 pl-1selselectedectedonChange0 pr-4 ${
                          active ? 'bg-blue-400 text-gray-900' : 'text-gray-900'
                        } ${
                          selected
                            ? 'bg-indigo-500 text-white'
                            : 'text-gray-900'
                        }`;
                      }}
                      value={itm}
                    >
                      {({ selected, active }) => {
                        if (itm.id == chosen.id) selected = true; // Shayan
                        return (
                          <>
                            <span
                              className={`block truncate  ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {itm.val}
                            </span>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400`}
                              >
                                <CheckIcon
                                  className='w-5 h-5'
                                  aria-hidden='true'
                                />
                              </span>
                            )}
                          </>
                        );
                      }}
                    </Combobox.Option>
                  );
                })
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
