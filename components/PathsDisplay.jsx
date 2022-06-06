import { useState, useEffect } from 'react'

const PathsDisplay = (props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  //? converts time given from the API to a more readable format
  function convertSecondsToTime(seconds) {
    const MINUTE = 60
    const HOUR = 60 * MINUTE
    const DAY = 24 * HOUR

    const days = Math.floor(seconds / DAY)
    const hours = Math.floor((seconds % DAY) / HOUR)
    const minutes = Math.floor((seconds % HOUR) / MINUTE)
    const secondsLeft = Math.floor(seconds % MINUTE)

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${days === 0 ? '' : `(+${days}d)`}`
  }

  function expand() {
    setIsExpanded(true)
  }

  return (
    <div className={props.className}>
      {
        ( 
          typeof props.data !== 'undefined' && props.data.length > 0 
        ) ? (
          <div className={`h-full px-4 flex flex-col ${isExpanded ? 'overflow-y-auto' : ''}`}>
            {
              (isExpanded ? props.data : props.data.slice(0, 3))
              .map((path, index) => (
                <div key={index}>
                  <div className='flex flex-row justify-start gap-1 pt-3 pb-2 h-1/3'>
                    <span>{convertSecondsToTime(path.departureTime)}</span>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    
                    <span>{convertSecondsToTime(path.arrivalTime)}</span>
                  </div>

                  <div className='flex flex-row justify-start pt-1 h-1/3'>
                    {'via '} 
                    {
                      Array.from(
                        new Set(
                          path.path
                          .map(station => station.trainId)
                        )
                      )
                      .filter(id => (id !== null))
                      .map(id => 'IR' + id)
                      .join(', ')
                    }
                  </div>

                  <div className='pb-3 border-b border-1 border-zinc-200'/>
                </div>
              ))
            }
            {
              (!isExpanded) ? 
              (
                <button className='pt-3 underline hover:cursor-pointer hover:text-gray-500' onClick={expand}>
                  View more
                </button>
              )
              : ''
            }
          </div>
        ) 
        : ''
      } 
    </div>
  )
}

export default PathsDisplay