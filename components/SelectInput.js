import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

export const SelectInput = (props) => {
  const { label, id, choises, optionTitle, optionValue, value } = props;
  let initSelect = {};
  var list = [];
  choises &&
    choises.forEach((choise) => {
      const itm = {
        id: choise[optionValueKey],
        val: optionTitleKey.reduce(
          (title, txt) =>
            /:/.test(txt)
              ? choise[txt.replace(/[,: ]/g, '')] &&
                title + txt + choise[txt.replace(/[,: ]/g, '')]
              : title + ' ' + choise[txt],
          ''
        ),
      };
      list.push(itm);
      if (value == itm.id) {
        initSelect = itm;
      }
    });

  const [chosen, setChosen] = useState(initSelect);
  const [fltr, setFltr] = useState('');

  const filteredList =
    fltr === ''
      ? list
      : list.filter((itm) =>
          itm.val
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(fltr.toLowerCase().replace(/\s+/g, ''))
        );

  return (
    <div
      dir='rtl'
      className='flex flex-col justify-between w-full m-0 align-baseline'
    >
      {label !== '' && (
        <label
          className='block mb-2 text-sm font-bold text-gray-700'
          // htmlFor={id}
        >
          {label}
        </label>
      )}
      <Combobox
        // id={id}
        value={chosen}
        onChange={setChosen}
        /* call setChosen when a new option is selected */
      >
        <div className='relative mt-1'>
          <div className='relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-teal-300 focus-visible:ring-offset-2 sm:text-sm'>
            <Combobox.Input
              className='w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0'
              displayValue={(item) => item.val}
              onChange={(e) => setFltr(e.target.value)}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
              <SelectorIcon
                className='w-5 h-5 text-gray-400'
                aria-hidden='true'
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setFltr('')}
          >
            <Combobox.Options className='absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {filteredList.length === 0 && fltr !== '' ? (
                <div className='relative px-4 py-2 text-gray-700 cursor-default select-none'>
                  یافت نمیشود
                </div>
              ) : (
                filteredList.map((itm) => (
                  <Combobox.Option
                    key={itm.id}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active ? 'text-white bg-teal-600' : 'text-gray-900'
                      }`
                    }
                    value={itm}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`flex ${
                            selected
                              ? 'font-extrabold'
                              : 'font-normal ext-teal-200'
                          }`}
                        >
                          {itm.val}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-red-600'
                            }`}
                          >
                            <CheckIcon className='w-5 h-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
