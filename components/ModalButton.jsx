import { useRef, useState } from 'react'

const ModalButton = (props) => {
  const refButton = useRef() //? ref to button
  const refModal = useRef() //? ref to modal

  const [isOpen, setIsOpen] = useState(false)

  function handleButtonClick(evt) {
    evt.preventDefault()

    setIsOpen(!isOpen)
  }

  return (
    <div>
      <div className='cursor-pointer' ref={refButton} onClick={handleButtonClick}>
        {props.children[0]}
      </div>

      <div className={isOpen ? `w-1/2 right-1/4 h-24 absolute z-20 top-8 bg-gray-100 rounded-lg p-5` : 'hidden'}  ref={refModal}>
        {props.children[1]}
      </div>
    </div>    
  )
}

export default ModalButton

