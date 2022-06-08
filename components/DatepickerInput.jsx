import { useState, useRef, useEffect, useCallback } from 'react'

import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'
import localeEn from 'air-datepicker/locale/en'

const DatepickerInput = ({ className, onSelect }) => {
  const refInput = useRef()
  const refDatepicker = useRef()

  const [isOpen, setIsOpen] = useState(false)

  function openDatpicker() {
    setIsOpen(true)
  }

  function closeDatepicker() {
    setIsOpen(false)
  }

  //? render datepicker
  useEffect(() => {
    new AirDatepicker(refDatepicker.current, {
      locale: localeEn,
      timepicker: true,
      timeFormat: 'HH:mm',
      onSelect: (date) => {
        if (typeof onSelect === 'function') {
          onSelect(date)
        }

        console.log(date)

        refInput.current.value = new Date(date.formattedDate).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })
        
        closeDatepicker()
      }
    })
  }, [onSelect])

  return (
    <div className={className}>
      <div className="relative flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        
        <input className='p-4' ref={refInput} onFocus={openDatpicker} type='text' readOnly/>
      </div>

      <div ref={refDatepicker} className={isOpen ? 'absolute mt-2' : 'hidden'}>

      </div>
    </div>
  )
}

export default DatepickerInput