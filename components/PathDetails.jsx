//* import hooks from the react framework
import {useEffect, useState} from 'react';

//* this component is used when a specific path is opened in detailed view
const PathDetails = (props) => {
  //* create a state for the trains array
  //* this state is initialised with an empty array since the trains will be written dynamically once the page is rendered
  const [trains, setTrains] = useState([]);

  //* write the train data to the 'trains' state
  useEffect(() => {
    //* start out with an empty map
    //* this maps every train id to its corresponding hour ranges
    let map = new Map();
    
    //* get the first train separately
    let firstTrain = props.path.path[0].trainId;

    let prevTrain = firstTrain;
    let prevStart = props.path.departureTime;
    //* loop through all the stations starting with the second
    for (let i = 1; i < props.path.path.length; i++) {
      let cTrain = props.path.path[i].trainId;

      if (cTrain !== prevTrain) {
        //* if the train changes between two stations, save the first train's range and begin a new range with the second train
        let endTime = props.path.path[i - 1].time;
        if (i === props.path.path.length - 1) {
          endTime = props.path.arrivalTime;
        }

        let prevRanges = [];
        if (map.has(prevTrain)) {
          prevRanges = map.get(prevTrain);
        }

        prevRanges.push({
          start: prevStart,
          end: endTime
        });

        map.set(prevTrain, prevRanges);

        //* update prev variables 
        prevTrain = cTrain;
        prevStart = props.path.path[i - 1].time;
      }
    }

    setTrains(Array.from(map.entries()));
    
  }, [props.path]);

  //* this function converts millisecond time given from the API to a more readable format
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

  //* this function fires when the 'Close' button is clicked 
  //* removes all data from the current path and returns the user to the home page
  function resetPath(evt) {
    evt.preventDefault();

    //* remove markers
    if (typeof props.fParentRemoveMarkers === 'function') {
      props.fParentRemoveMarkers();
    }
    else {
      console.log('fParentRemoveMarkers is not a function');
    }

    //* remove previous search results
    if (typeof props.fParentRemovePaths === 'function') {
      props.fParentRemovePaths();
    }
    else {
      console.log('fParentRemovePaths is not a function');
    }
    
    //* remove selected path
    if (typeof props.fParentSelectPath === 'function') {
      props.fParentSelectPath(null);
    }
    else {
      console.log('props.fParentSelectPath is not a function');
    }
  }
  
  return (
    <div className='flex flex-col items-center justify-start w-full h-full pt-10 overflow-y-auto'>
      {/* close button lol */}
      <div className="flex flex-row items-center justify-end w-full">
        <div className='pr-4 text-gray-800 cursor-pointer hover:text-gray-600' onClick={resetPath}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>


      {/* train details */}
      <div className='flex flex-col items-center w-full pt-4 justify-evenly'>
        <span className='text-xl'> Train Info </span>

        <div className="w-full px-10 pt-8 text-left">
          <span className='text-lg'>{trains.length === 1 ? 'Direct route' : `Switching through ${trains.length} trains`}</span>

          <div className='flex flex-col items-start w-full pt-4'>
            {
              //* this div shows the train data
              trains.map(([trainId, ranges], index) => {
                return (
                  <div className='flex flex-col w-full py-3' key={`train-${index}`}>
                    <span className='block'>Train ID: {trainId} </span>
                    <div className='flex flex-row w-full'>
                      {
                        ranges.map((range, index) => {
                          return (
                            <>
                              {
                                index > 0 ? 
                                <span>&nbsp;|&nbsp; </span>
                                : null
                              }
                              <span key={`range-${index}`}> {convertSecondsToTime(range.start)} - {convertSecondsToTime(range.end)}</span>
                            </>
                          )
                        })
                      }
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
        
      </div>

      {/* full time + time for each station */}
      <div className='flex flex-col items-center w-full pt-20 justify-evenly'>
        <span className='text-xl'>
          Travel Time
        </span>

        <div className="w-full px-10 pt-8 text-left">
          <span className='block text-lg'>
            Overall trip duration: {convertSecondsToTime(props.path.departureTime)} - {convertSecondsToTime(props.path.arrivalTime)}
          </span>

          <span className='block pt-3 text-lg'>
            Detailed travel time per station:
          </span>

          <div className="flex flex-col w-full gap-5 pt-4">
            {
              //* this div shows a list of stations
              props.path.path.map((cStation, index, array) => {
                return (
                  index >= 1 ? (
                    <div key={`station-${index}`}>
                      <span className='block'>{array[index - 1].name} - {cStation.name}</span>
                      <span className='block'>{convertSecondsToTime(array[index - 1].time)} - {convertSecondsToTime(cStation.time ?? props.path.arrivalTime)}</span>
                    </div>
                  ) : null
                );
              })
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default PathDetails