//* import hooks from the react framework
import { useState, useRef, useEffect } from 'react';

//* datepicker is the library used to style the calendar input
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import localeEn from 'air-datepicker/locale/en';

//* this component is used on the trip detail selection form, where the user selects their desired date to travel
const DatepickerInput = ({ 'onSelect': fParentOnSelect, 'className': mParentClassName }) => {
  //* create references for the components
  const refInput = useRef();
  const refDatepicker = useRef();

  //* create a state specifying whether the calendar popup should be open or not
  //* this is initialised with false since the calendar is closed at the time this component is first rendered
  const [isOpen, setIsOpen] = useState(false);

  //* this function closes the calendar popup by setting the 'isOpen' state to false
  function mCloseDatepicker() {
    setIsOpen(false);
  } 

  //* this function inverts the state of the calendar popup by changing the value of the 'isOpen' state to its opposite
  function mSwitchDatepickerOpen() {
    setIsOpen(!isOpen);
  }

  //* this function fires whenever the calendar icon is clicked and opens the calendar popup by setting the 'isOpen' state to true
  function mHandleClick(evt) {
    //* prevent the default outcome of the click event 
    evt.preventDefault();

    setIsOpen(true);
  }

  //* render datepicker
  useEffect(() => {
    //* due to AirDatepicker being an external library, the calendar popup needs to be rendered in a separate function

    //* the refDatepicker reference marks a specific div designed to render the datepicker popup
    new AirDatepicker(refDatepicker.current, {
      locale: localeEn, //* set the date format to normal format
      onSelect: (date) => {
        if (typeof fParentOnSelect === 'function') {
          fParentOnSelect(date);
          //* when a date is selected fire the parent function
        }

        //* save the date to the input component value
        refInput.current.value = new Date(date.formattedDate).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        
        //* close the datepicker popup after a date is selected
        mCloseDatepicker();
      }
    })
  }, [fParentOnSelect]);

  return (
    <div className={mParentClassName}>
      <div className="relative flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} onClick={mSwitchDatepickerOpen}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        
        <input className='p-4 rounded-lg' ref={refInput} onClick={mHandleClick} type='text' placeholder='Choose travel date' readOnly/>
      </div>

      <div ref={refDatepicker} className={isOpen ? 'absolute mt-2 z-10' : 'hidden'}>

      </div>
    </div>
  );
}

export default DatepickerInput;