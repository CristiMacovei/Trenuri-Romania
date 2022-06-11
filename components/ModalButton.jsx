import { useEffect, useRef, useState } from 'react'

const ModalButton = (props) => {
  const refButton = useRef() //? ref to button
  const refModal = useRef() //? ref to modal

  const refContent = useRef()

  const [isOpen, setIsOpen] = useState(false)

  function handleFocusLost(evt) {
    if (!refContent.current.contains(evt.target)) {
      setIsOpen(false)
    }
  }

  function handleButtonClick(evt) {
    evt.preventDefault()

    if (!isOpen) {
      setIsOpen(true)

      console.log(props.effect)

      if (typeof props.effect === 'function') {
        props.effect()
      }
    }
    else {
      setIsOpen(false)
    }
  }

  return (
    <div>
      <div className='cursor-pointer' ref={refButton} onClick={handleButtonClick}>
        {props.children[0]}
      </div>

      <div onClick={handleFocusLost} className={isOpen ? `w-screen h-screen absolute top-0 right-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center` : 'hidden'}  ref={refModal}>
        <div className='flex items-center justify-center'>
          <div ref={refContent}>
            {props.children[1]}
          </div>
        </div>
      </div>
    </div>    
  )
}

export default ModalButton

