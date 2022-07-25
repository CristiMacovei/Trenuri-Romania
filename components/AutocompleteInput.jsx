//* import functionality from the react framework
import React, { useState, useRef } from 'react';

//* this component is used in the trip details form, when the user selects their desiered start and destination
const AutocompleteInput = (props) => {
  //* create a new state for the dropdown visibility
  //* initialise it with false since the dropdown is not visible the first time the component is rendered
  //* when this is changed to true, the dropdown div is rendered
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  //* create a new state for the dropdown data
  //* initialised as an empty array, this will later be used to store the matches from the autcomplete
  const [dropdownData, setDropdownData] = useState([]);

  //* create references for components
  const refDropdown = useRef();

  //* this function runs whenever the input's change event is triggered
  function handleChange(evt) {    
    //* remove markers on change evt
    if (typeof props.fParentRemoveMarker === 'function') {
      props.fParentRemoveMarker();
    }

    //* remove paths on change evt
    if (typeof props.fParentRemovePaths === 'function') {
      props.fParentRemovePaths();
    }
    
    //* hide dropdown if the field is empty
    if (evt.target.value.length === 0) {
      setIsDropdownVisible(false);

      return;
    }

    //* if the field is not empty, then find all the matches and display them in the dropdown
    
    //* match them by compressed name to provide the user a better experience
    //* for example '  buzau ' matches 'Buzău' in compressed names, saving the user the effort of writing the station names perfectly 
    const matches = props.data.filter(({ compressedName }) => {
      return compressedName.startsWith(props.fParentCompressName(evt.target.value.toLowerCase()));
    });

    //* if no matches are found hide the dropdown
    if (matches.length === 0) {
      setIsDropdownVisible(false);
    }
    //* otherwise display the matches in the dropdown
    else {
      setIsDropdownVisible(true);

      setDropdownData(matches);
    }
  }

  //* this function is used when the user clicks one of the fields from the dropdown
  //* it automatically gets the station data from the given field and saves it in the input values, from where they are handled by the form submission event
  function setValue(id, name, lat, lon) {
    props.refInput.current.value = name;
    props.refIdInput.current.value = id;
    props.refLatInput.current.value = lat;
    props.refLonInput.current.value = lon;

    //* hide the dropdown after selection
    setIsDropdownVisible(false);

    //* call the function passed as a prop from the parent component
    props.handleSelected();
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

      <input type="number"
        name={props.name + '-lat'} 
        className='hidden'
        ref={props.refLatInput}
      />

      <input type="number"
        name={props.name + '-lon'}
        className='hidden'
        ref={props.refLonInput}
      />

      <div className={isDropdownVisible ? 'border border-zinc-200 rounded-lg absolute flex flex-col gap-4 mt-8 ml-4 w-64 p-4 max-h-96 overflow-y-auto z-20 bg-white' : 'hidden'} ref={refDropdown}>
        {
          dropdownData.map(( { stationId, stationName, latitude, longitude } ) => {
            return (
              <div key={stationId} className='p-2 hover:cursor-pointer hover:bg-gray-100' onClick={function() { setValue(stationId, stationName, latitude, longitude) }}>
                {stationName}
              </div>
            );
          })
        }
      </div>
    </>
  )
}

export default AutocompleteInput;