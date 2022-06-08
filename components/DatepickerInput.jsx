import { useState, useRef, useEffect, useCallback } from 'react'

import AirDatepicker from 'air-datepicker'
import 'air-datepicker/air-datepicker.css'
import localeEn from 'air-datepicker/locale/en'

const DatepickerInput = ({ className, onSelect }) => {
  const refInput = useRef()
  const refDatepicker = useRef()

  const [isOpen, setIsOpen] = useState(false)

  function mCloseDatepicker() {
    setIsOpen(false)
  } 

  function mSwitchDatepickerOpen() {
    setIsOpen(!isOpen)
  }

  function mHandleClick(evt) {
    evt.preventDefault()

    setIsOpen(true)
  }

  //? render datepicker
  useEffect(() => {
    new AirDatepicker(refDatepicker.current, {
      locale: localeEn,
      onSelect: (date) => {
        if (typeof onSelect === 'function') {
          onSelect(date)
        }

        console.log(date)

        refInput.current.value = new Date(date.formattedDate).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        
        mCloseDatepicker()
      }
    })
  }, [onSelect])

  return (
    <div className={className}>
      <div className="relative flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} onClick={mSwitchDatepickerOpen}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        
        <input className='p-4' ref={refInput} onClick={mHandleClick} type='text' placeholder='Choose travel date' readOnly/>
      </div>

      <div ref={refDatepicker} className={isOpen ? 'absolute mt-2' : 'hidden'}>

      </div>
    </div>
  )
}

export default DatepickerInput