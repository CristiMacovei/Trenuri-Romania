import { useRef, useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import axios from 'axios'

import AutocompleteInput from '../components/AutocompleteInput'

const IndexPage = () => {

  const main = useRef()

  const [stations, setStations] = useState([])

  function handleFormSubmit(evt) {
    evt.preventDefault()

    const fData = new FormData(evt.target)
    
    const data = {
      startId: fData.get('start-station-id'),
      destId: fData.get('destination-station-id')
    }

    console.log(data)
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

  return (
    <div ref={main} className='hidden'>
      {/* map  */}
      <div>
        Map
      </div>

      {/* input */}
      <form className='w-full' onSubmit={handleFormSubmit}>
        <div className='flex justify-center gap-8 align-center'>
          <div className='w-1/5'>
            <AutocompleteInput data={stations} name='start-station' className='w-full h-16 p-4 border rounded-lg focus:outline-none' placeholder='Choose starting station' />
          </div>

          <div className='w-1/5'>
            <AutocompleteInput data={stations} name='destination-station' className='w-full h-16 p-4 border rounded-lg focus:outline-none' placeholder='Choose destination station'/>
          </div>
        </div>

        <div className="flex items-center justify-center mt-10">
          <input type="submit" value="Find Route" className='p-5 bg-blue-300 rounded-lg hover:cursor-pointer hover:bg-blue-400'/>
        </div>
      </form>
    </div>
  )
}

export default IndexPage
