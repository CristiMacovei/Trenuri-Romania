//* import hooks from the react framework
import { useState, useEffect } from 'react';

//* this component is used to display the search results in the homepage trip interface 
const PathsDisplay = (props) => {
  //* create a state for whether the display is expanded
  //* initially it is not, showing only 3 paths (the fastest ones)
  //* if the user wishes to see more paths, they can click the 'View more' button and see all the paths
  const [isExpanded, setIsExpanded] = useState(false);

  //* converts the millisecond time given from the API to a more readable format
  function convertSecondsToTime(seconds) {
    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;

    const days = Math.floor(seconds / DAY);
    const hours = Math.floor((seconds % DAY) / HOUR);
    const minutes = Math.floor((seconds % HOUR) / MINUTE);
    const secondsLeft = Math.floor(seconds % MINUTE);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${days === 0 ? '' : `(+${days}d)`}`;
  }

  //* this function is used to expand the paths list
  //* fires when the 'View more' button is clicked
  function expand() {
    setIsExpanded(true);
  }

  //* set the 'isExpanded' state to false every time the data changes
  useEffect(() => {
    setIsExpanded(false);
  }, [props.data]);

  return (
    <div className={props.className}>
      {
        ( 
          typeof props.data !== 'undefined' && props.data.length > 0 
        ) ? (
          <div className={`h-full px-4 flex flex-col ${isExpanded ? 'overflow-y-auto' : ''}`}>
            {
              (isExpanded ? props.data : props.data.slice(0, 3)) //* show only the first 3 if not expanded
              .map((path, index) => (
                <div key={index} className='flex flex-row items-center justify-between pr-3'>
                  <div className="block h-full pt-3">
                    <div className='flex flex-row justify-start gap-1 pb-2 h-1/3'>
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
                        .join(', ')
                      }
                    </div>

                    <div className='pb-3 border-b border-1 border-zinc-200'/>
                  </div>
                  
                  <div className="flex items-center justify-center" onClick={() => {
                    //* on user click, select this path

                    if (typeof props.fParentSelectPath !== 'function') {
                      console.log('props.fParentSelectPath is not a function');

                      return;
                    }

                    props.fParentSelectPath(path);
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="#444" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
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