import React, { useState, useRef } from 'react'

const AutocompleteInput = (props) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [dropdownData, setDropdownData] = useState([])

  const input = useRef()
  const idInput = useRef()
  const dropdown = useRef()

  function handleChange(evt) {    
    //* remove markers on change evt
    if (typeof props.fParentRemoveMarker === 'function') {
      props.fParentRemoveMarker();
    }

    //* remove paths on change evt
    if (typeof props.fParentRemovePaths === 'function') {
      props.fParentRemovePaths();
    }
    
    if (evt.target.value.length === 0) {
      setIsDropdownVisible(false) 

      return
    }

    const matches = props.data.filter(({ stationId, compressedName }) => {
      return compressedName.startsWith(props.fParentCompressName(evt.target.value.toLowerCase()))
    })

    if (matches.length !== 0) {
      setIsDropdownVisible(true)

      setDropdownData(matches)
      // console.log(matches)
    }
    else {
      setIsDropdownVisible(false)
    }
  }

  function setValue(id, name) {
    props.refInput.current.value = name
    props.refIdInput.current.value = id

    setIsDropdownVisible(false)

    props.handleSelected()
  }

  return (
    <>
      <input 
        type='text'
        autoComplete='off'
        name={props.name}
        autocompleteData={props.data} 
        className={props.className} 
        placeholder={props.placeholder} 
        onChange={handleChange}
        ref={props.refInput}
      />

      <input 
        type="text" 
        name={props.name + '-id'} 
        className='hidden'
        ref={props.refIdInput}
      />

      <div className={isDropdownVisible ? 'border border-zinc-200 rounded-lg absolute flex flex-col gap-4 mt-8 ml-4 w-64 p-4 max-h-96 overflow-y-auto z-20 bg-white' : 'hidden'} ref={dropdown}>
        {
          dropdownData.map(( { stationId, stationName } ) => {
            return (
              <div key={stationId} data-id={stationId} className='p-2 hover:cursor-pointer hover:bg-gray-100' onClick={function() { setValue(stationId, stationName) }}>
                {stationName}
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default AutocompleteInput