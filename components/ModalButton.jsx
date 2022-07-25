//* import hooks from the react framework
import { useEffect, useRef, useState } from 'react';

//* this component is used on the 3 buttons inside the Navbar
//* it has a button that when clicked opens up a modal and covers the rest of the page
const ModalButton = (props) => {
  //* create references for the components
  const refButton = useRef();
  const refModal = useRef();
  const refContent = useRef();

  //* create a state for whether the modal is open or not
  //* initialised to false since the modals shouldn't be shown the first time this component is rendered
  const [isOpen, setIsOpen] = useState(false);

  //* this function fires when the modal loses focus (ie when the user clicks anywhere else on the screen)
  function handleFocusLost(evt) {
    if (!refContent.current.contains(evt.target)) {
      setIsOpen(false); //* close the modal on focus lost
    }
  }

  //* this function fires when the target button is clicked 
  function handleButtonClick(evt) {
    evt.preventDefault();

    if (!isOpen) {
      setIsOpen(true);

      //* if there's any effect on the modal, fire that function 
      if (typeof props.effect === 'function') {
        props.effect();
      }
    }
    else {
      setIsOpen(false);
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

