import { useRef, useEffect, useState, useMemo } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';

import dynamic from 'next/dynamic';

import AutocompleteInput from '../components/AutocompleteInput';
import Navbar from '../components/Navbar';
import PathsDisplay from '../components/PathsDisplay';
import PathDetails from '../components/PathDetails';
import DatepickerInput from '../components/DatepickerInput';

const IndexPage = () => {
  const main = useRef();
  
  const refStartInput = useRef();
  const refStartIdInput = useRef();
  const refStartLatInput = useRef();
  const refStartLonInput = useRef();

  const refDestInput = useRef();
  const refDestIdInput = useRef();
  const refDestLatInput = useRef();
  const refDestLonInput = useRef();
  
  const [nightTheme, setNightTheme] = useState(false);
  const [stations, setStations] = useState([]);
  const [paths, setPaths] = useState([]);
  const [markers, setMarkers] = useState({ start: null, dest: null });
  const [selectedPath, setSelectedPath] = useState(null);
  const [markerColor, setMarkerColor] = useState('#ff0000');
  const [detailsColor, setDetailsColor] = useState('#00ff00');

  const MapWithNoSSR = dynamic(() => import("../components/Map"), {
    ssr: false
  });

  function compressName(string) {
    return string.toLowerCase().replaceAll(' ', '').replaceAll('.', '').replaceAll('â', 'a').replaceAll('ă', 'a').replaceAll('î', 'i').replaceAll('ș', 's').replaceAll('ş', 's').replaceAll('ț', 't').replaceAll('ţ', 't');
  }

  function removePaths() {
    setPaths([]);
  }

  async function handleFormSubmit(evt) {
    evt.preventDefault()

    const fData = new FormData(evt.target)
    
    const data = {
      startId: fData.get('start-station-id'),
      destId: fData.get('destination-station-id')
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/path/v2`, {
      params: data,
      headers: {
        'Authorization': getCookie('qwe-token')
      }
    })

    console.log(res)

    if (res.data.status !== 'success') {
      setPaths([])
    }
    else {
      setPaths(res.data.pathsArr)
    }
  }
  
  //? verify token & redirect if invalid
  useEffect(() => {
    const tokenCookie = getCookie('qwe-token')

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
      token: tokenCookie
    })
    .then(res => {
      console.log(res)

      if (res.data.status === 'success') {
        main.current.classList.remove('hidden')
        main.current.classList.add('flex')
      }
      else {
        window.location.href = '/login'
      }
    })

    
  }, [])

  //? fetch stations on page load for autocomplete
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/data/stations`)
    .then(res => {      
      setStations(res.data.stations.map(i => ({
        ...i,
        compressedName: compressName(i.stationName)
      })))
    })
  }, [])

  function handleStartSelected(evt) {
    setPaths([]);

    setMarkers({
      start: {
        position: [refStartLatInput.current.value, refStartLonInput.current.value],
        name: refStartInput.current.value
      },
      dest: markers.dest
    });
  }

  function handleDestSelected(evt) {
    setPaths([]);
    
    setMarkers({
      start: markers.start,
      dest: {
        position: [refDestLatInput.current.value, refDestLonInput.current.value],
        name: refDestInput.current.value
      }
    });
  }

  function removeMarkers() {
    if (markers.start === null && markers.dest === null) {
      return;
    }
    
    setMarkers({ start: null, dest: null });
  }

  function removeStartMarker() {
    if (markers.start === null) {
      return;
    }

    setMarkers({ start: null, dest: markers.dest });
  }

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
      
      <div className={`${nightTheme ? 'bg-gray-700' : 'bg-white'} relative flex flex-col justify-center w-1/4 h-full`}>
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
