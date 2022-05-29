import { useRef, useEffect, useState, useMemo } from 'react'
import { getCookie } from 'cookies-next'
import axios from 'axios'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import AutocompleteInput from '../components/AutocompleteInput'
import Navbar from '../components/Navbar'


const IndexPage = () => {
  const main = useRef()
  const [markers, setMarkers] = useState({ start: null, dest: null })

  const refStartInput = useRef()
  const refStartIdInput = useRef()
  const refDestInput = useRef()
  const refDestIdInput = useRef()

  const MapWithNoSSR = dynamic(() => import("../components/Map"), {
    ssr: false
  });

  const [stations, setStations] = useState([])

  async function handleFormSubmit(evt) {
    evt.preventDefault()

    const fData = new FormData(evt.target)
    
    const data = {
      startId: fData.get('start-station-id'),
      destId: fData.get('destination-station-id')
    }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/path`, {
      token: getCookie('token'),
      params: data
    })

    const path = res.data.path

    console.log(path)

    document.querySelector('#path-result').innerHTML = `<p>Starting at ${data.startId}</p>` +
    path.map(({ id, trainId }) => {
      return `<p>to ${id} via IR${trainId}</p>`
    }).join('')
    + `<p>Destination at ${data.destId}</p>`
  }
  
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

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/data/stations`)
    .then(res => {
      setStations(res.data.stations)
    })
  }, [])

  function handleStartSelected(evt) {
    axios.get(`https://nominatim.openstreetmap.org/search.php?q=${refStartInput.current.value}&format=jsonv2`)
    .then(res => {
      setMarkers({
        start: {
          position: [res.data[0].lat, res.data[0].lon],
          name: res.data[0].display_name
        },
        dest: markers.dest
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  function handleDestSelected(evt) {
    axios.get(`https://nominatim.openstreetmap.org/search.php?q=${refDestInput.current.value}&format=jsonv2`)
    .then(res => {
      setMarkers({
        start: markers.start,
        dest: {
          position: [res.data[0].lat, res.data[0].lon],
          name: res.data[0].display_name
        }
      })
    })
    .catch(err => {
      console.log(err)
    })
  }
  
  return (
    <div ref={main} className='relative flex-row hidden w-screen h-screen'>
      {/* <Image src='/background.jpg' className='relative object-cover' layout='fill' alt='Cainele'/>
       */}

      <div className='w-4/5 h-screen'>
        <MapWithNoSSR markers={markers}/>
      </div>
      
      <div className='relative w-1/5 h-full'>
        {/* navbar */}
        <Navbar className='pt-8 h-1/6'/>

        {/* input */}
        <form className='w-full h-1/3' onSubmit={handleFormSubmit}>
          <div className='flex flex-col items-center justify-center gap-8 align-center'>
            <div className='w-5/6 '>
              <AutocompleteInput refInput={refStartInput} refIdInput={refStartIdInput} handleSelected={handleStartSelected} data={stations} name='start-station' className='w-full h-16 p-4 border rounded-lg focus:outline-none' placeholder='Choose starting station' />
            </div>

            <div className='w-5/6'>
              <AutocompleteInput refInput={refDestInput} refIdInput={refDestIdInput} handleSelected={handleDestSelected} data={stations} name='destination-station' className='w-full h-16 p-4 border rounded-lg focus:outline-none' placeholder='Choose destination station'/>
            </div>
          </div>

          <div className="flex items-center justify-center mt-10">
            <input type="submit" value="Find Route" className='p-5 bg-blue-300 rounded-lg hover:cursor-pointer hover:bg-blue-400'/>
          </div>
        </form>

        {/* path */}
        <div id='path-result'>
          
        </div>
        
      </div>
    </div>
  )
}

export default IndexPage
