//* import the hooks from the react framework
import { useRef, useEffect, useState } from 'react';

//* import the cookie handling functions provided by next to store the auth token in the cookies
import { getCookie } from 'cookies-next';

//* import axios for making requests to the backend server
import axios from 'axios';

//* use next dynamic rendering since the Leaflet.js map does not support server-side rendering (ssr)
import dynamic from 'next/dynamic';

//* import custom components
import AutocompleteInput from '../components/AutocompleteInput';
import Navbar from '../components/Navbar';
import PathsDisplay from '../components/PathsDisplay';
import PathDetails from '../components/PathDetails';
import DatepickerInput from '../components/DatepickerInput';

const IndexPage = () => {
  //* create references for all the components
  const main = useRef();
  
  const refStartInput = useRef();
  const refStartIdInput = useRef();
  const refStartLatInput = useRef();
  const refStartLonInput = useRef();

  const refDestInput = useRef();
  const refDestIdInput = useRef();
  const refDestLatInput = useRef();
  const refDestLonInput = useRef();
  
  //* this is used to store all the stations that are provided by the API
  //* this will later be used as data for the autocomplete inputs
  const [stations, setStations] = useState([]);

  //* this contains the paths found by the API and that should be displayed as result of the user's search
  const [paths, setPaths] = useState([]);

  //* contains data related to the map markers
  //* if one of the 2 markers is set to null, then no station is selected for either start or destination
  const [markers, setMarkers] = useState({ start: null, dest: null });

  //* contains the path opened in detailed view 
  //* if this is set to null, there's no path opened in detailed view
  const [selectedPath, setSelectedPath] = useState(null);

  //* user prefference states
  const [markerColor, setMarkerColor] = useState('#ff0000');
  const [detailsColor, setDetailsColor] = useState('#07a309');

  //* import the map without server-side rendering
  const MapWithNoSSR = dynamic(() => import("../components/Map"), {
    ssr: false
  });

  //* the same as the function used in the autocomplete component and the API
  function compressName(string) {
    return string.toLowerCase().replaceAll(' ', '').replaceAll('.', '').replaceAll('â', 'a').replaceAll('ă', 'a').replaceAll('î', 'i').replaceAll('ș', 's').replaceAll('ş', 's').replaceAll('ț', 't').replaceAll('ţ', 't');
  }

  //* clear all search results
  function removePaths() {
    setPaths([]);
  }

  //* this fires when the user submits the homepage trip detail form
  async function handleFormSubmit(evt) {
    //* prevent the default behaviour of form submission
    evt.preventDefault();

    //* get all the data from the FormData object
    const fData = new FormData(evt.target);
    
    const data = {
      startId: fData.get('start-station-id'),
      destId: fData.get('destination-station-id')
    };

    //* send a request to the API to get the paths
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/path/v2`, {
      params: data,
      headers: {
        'Authorization': getCookie('qwe-token')
      }
    });

    //* if there's no success clear everything
    if (res.data.status !== 'success') {
      setPaths([]);
    }
    //* otherwise display the paths
    else {
      setPaths(res.data.pathsArr);
    }
  }
  
  //* on page render verify the token & redirect if invalid
  useEffect(() => {
    //* fetch token from the cookie
    const tokenCookie = getCookie('qwe-token');

    //* verify the token with the backend server
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
      token: tokenCookie
    })
    .then(res => {
      console.log(res)

      //* if the token is valid show the homepage interface, otherwise redirect back to the login page
      if (res.data.status === 'success') {
        main.current.classList.remove('hidden');
        main.current.classList.add('flex');
      }
      else {
        window.location.href = '/login';
      }
    })

    
  }, []);

  //* fetch stations on page load for autocomplete
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/data/stations`)
    .then(res => {      
      setStations(res.data.stations.map(i => ({
        ...i,
        compressedName: compressName(i.stationName)
      })))
    })
  }, [])

  //* this function fires when the user selects a start station from the first autocomplete input
  function handleStartSelected(evt) {
    //* clear the paths
    setPaths([]);

    //* set the start marker to the given station's location
    setMarkers({
      start: {
        position: [refStartLatInput.current.value, refStartLonInput.current.value],
        name: refStartInput.current.value
      },
      dest: markers.dest
    });
  }

  //* this function fires when the user selects a destination station from the first autocomplete input
  function handleDestSelected(evt) {
    //* clear the paths
    setPaths([]);
    
    
    //* set the destination marker to the given station's location
    setMarkers({
      start: markers.start,
      dest: {
        position: [refDestLatInput.current.value, refDestLonInput.current.value],
        name: refDestInput.current.value
      }
    });
  }

  //* remove both markers
  function removeMarkers() {
    //* if they're already null, nothing to be done
    if (markers.start === null && markers.dest === null) {
      return;
    }
    
    setMarkers({ start: null, dest: null });
  }

  //* remove just the start marker
  function removeStartMarker() {
    if (markers.start === null) {
      return;
    }

    setMarkers({ start: null, dest: markers.dest });
  }

  //* remove just the destination marker
  function removeDestMarker() {
    if (markers.dest === null) {
      return;
    }

    setMarkers({ start: markers.start, dest: null });
  }
  
  return (
    <div ref={main} className={'relative flex-row hidden w-screen h-screen overflow-hidden'}>
      <div className='z-10 w-3/4 h-screen'>
        <MapWithNoSSR 
          markers={markers} 
          selectedPath={selectedPath}
          markerColor={markerColor}
          detailsColor={detailsColor}
        />
      </div>
      
      <div className={`bg-white relative flex flex-col justify-center w-1/4 h-full`}>
        {
          //* if there's a path selected, display info about that specific path, otherwise display the default interface
        }
        {
          selectedPath !== null ?
          <>
            <PathDetails 
              path={selectedPath}
              fParentSelectPath={setSelectedPath}
              fParentRemoveMarkers={removeMarkers}
              fParentRemovePaths={removePaths}
            />
          </>
          :
          <>
            {/* navbar */}
            <Navbar 
              className='py-6'
              fParentSetMapMarkerColor={setMarkerColor}
              pParentMarkerColor={markerColor}
              fParentSetMapDetailsColor={setDetailsColor}
              pParentMapDetailsColor={detailsColor}
            />

            {/* input */}
            <form className='w-full' onSubmit={handleFormSubmit} noValidate={true}>
              <div className='flex flex-col w-full h-full gap-3'>
                <div className='flex flex-col items-center justify-center gap-8 align-center'>
                  <div className='w-5/6'>
                    <DatepickerInput className='w-full p-2 border-0 rounded-lg outline-none focus:outline-none'/>
                    
                    <AutocompleteInput 
                      refInput={refStartInput} 
                      refIdInput={refStartIdInput}
                      refLatInput={refStartLatInput} 
                      refLonInput={refStartLonInput}
                      handleSelected={handleStartSelected}
                      fParentRemoveMarker={removeStartMarker}
                      fParentRemovePaths={removePaths}
                      fParentCompressName={compressName}
                      data={stations} 
                      name='start-station' 
                      className='w-full p-4 border rounded-lg focus:outline-none' 
                      placeholder='Choose starting station' 
                    />
                  </div>

                  <div className='w-5/6'>
                    <AutocompleteInput 
                      refInput={refDestInput} 
                      refIdInput={refDestIdInput}
                      refLatInput={refDestLatInput}
                      refLonInput={refDestLonInput}
                      handleSelected={handleDestSelected} 
                      fParentRemoveMarker={removeDestMarker}
                      fParentRemovePaths={removePaths}
                      fParentCompressName={compressName}
                      data={stations} 
                      name='destination-station' 
                      className='w-full h-16 p-4 border rounded-lg focus:outline-none' 
                      placeholder='Choose destination station'
                    />
                  </div>

                </div>

                <div className='flex items-center justify-center'>
                  <input type='submit' value='Find Route' className='p-5 bg-blue-300 rounded-lg hover:cursor-pointer hover:bg-blue-400'/>
                </div>
              </div>
            </form>
            
            {/* show paths found */}
            <PathsDisplay 
              data = {paths}
              className='pt-3 h-1/2'
              fParentSelectPath={setSelectedPath}
            />
          </>
        }
      </div>
    </div>
  )
}

export default IndexPage
