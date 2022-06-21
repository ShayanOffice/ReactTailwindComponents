import {
  faAnchorCircleExclamation,
  faCirclePlus,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

export default function Validator(props) {
  var { children } = props;
  const [childrenToRender, setChildrenToRender] = useState();

  const ConstructNewChildren = (reactElement) => {
    var theChildren;
    if (reactElement) theChildren = reactElement.props?.children;
    else theChildren = children;

    var validatedChildren = [];
    for (let i = 0; i < React.Children.toArray(theChildren).length; i++) {
      const eachChild = React.Children.toArray(theChildren)[i];
      var newChild = eachChild;
      if (eachChild.props?.children)
        newChild = React.cloneElement(
          eachChild,
          { className: eachChild.props?.className + ' relative' },
          ConstructNewChildren(eachChild)
        );
      validatedChildren.push(newChild);
      if (eachChild.props?.rules)
        var validationTxt = validate(
          eachChild.props.rules,
          eachChild.props.value
        );
      if (props.show)
        validatedChildren.push(MakeValidationElement(validationTxt));
    }
    return validatedChildren;
  };

  const validate = (rules, value) => {
    for (let i = 0; i < rules.length; i++) {
      const rule = rules[i];
      switch (rule) {
        case 'required':
          if (!value || value == '' || value == -1) {
            props.validations.push(false);
            return valdationDictionary['required'];
          }
          break;
        default:
          break;
      }
    }
  };
  const MakeValidationElement = (text) =>
    text ? (
      <div
        dir='rtl'
        className='absolute  top-[0%] translate-y-[-50%] translate-x-[-50%] z-[1] flex items-start justify-start  text-[0.6rem] italic text-center pointer-events-none shadow-xl'
      >
        <div className='relative h-5 p-1 mt-2 mr-2 text-white bg-[#e62d55] rounded w-fit shadow-xl'>
          <div className='h-5 p-2 absolute bottom-[-15%] right-[10%] rotate-[30deg] bg-[#e62d55] shadow-lg' />
          <h className='drop-shadow-sm'>{text + ' '}</h>
          <FontAwesomeIcon
            icon={faExclamationCircle}
            className={`opacity-50`}
          />
        </div>
      </div>
    ) : (
      <></>
    );

  const valdationDictionary = {
    ...props.dictionary,
    required: 'اطلاعات ضروری را وارد کنید',
  };

  const injectValidationElement = (targetElement, validationText) => {
    var theChildren = targetElement?.props?.children;
    // Checking isValidElement is the safe way and avoids a typescript error too.

    if (React.isValidElement(targetElement) && props.show) {
      const FinalChildren = [
        MakeValidationElement(validationText),
        ...React.Children.toArray(theChildren),
      ];
      const newElement = React.cloneElement(
        targetElement,
        { className: targetElement.props?.className + ' relative' },
        [...FinalChildren]
      );

      return newElement;
    }
    return targetElement;
  };

  useEffect(() => {
    setChildrenToRender(ConstructNewChildren());
  }, [children]);

  return (
    <>
      {childrenToRender}
      {/* {console.log(childrenToRender)} */}
    </>
  );
}
