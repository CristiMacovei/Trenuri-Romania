//* import the hooks from the react framework
import { useRef, useEffect, useState } from 'react';

//* import the cookie handling functions provided by next
import { removeCookies, getCookie } from 'cookies-next';

//* axios is used to send requests to the backend server
import axios from 'axios';

//* import the previous components
import ModalButton from './ModalButton';
import StyledButton from './StyledButton';
import ColorInput from './ColorInput';

//* this component is used in the main user interface and contains the 3 user buttons
const Navbar = (props) => {
  //* create references for the components
  const refAccountSpan = useRef();
  const refHistory = useRef();

  //* create a state for the history
  //* this is initialised as an empty array since it will be fetched via a request to the backend server when the page is rendered
  const [history, setHistory] = useState([]);

  //* this function logs the user out and it fires when the user clicks the 'Log out' button inside the account modal
  function logOut() {
    //* delete the token cookie
    removeCookies('qwe-token');

    //* redirect to the login page
    window.location.href = '/login';
  }
 
  //* when the page is rendered check the integrity of the token cookie to make sure the user is authenticated
  useEffect(() => {
    //* get the cookie token
    const token = getCookie('qwe-token');

    //* verify it with the backend server
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
      token
    })
    .then(res => {
      console.log('Attempting to authenticate user', token, res.data);

      if (res.data.status === 'success') {
        //* display user data
        refAccountSpan.current.innerHTML = `Logged in as ${res.data.user.username}`;
      }
      else {
        //* if the token is invalid, delete it and redirect to the login page
        logOut();
      }
    });
  }, []);

  //* this function is used to fetch the user's history from the backend server
  async function fetchHistory() {
    //* get the token from the cookie
    //* at this point we already assume the token is verified
    const token = getCookie('qwe-token');

    //* send a request to the /history endpoint
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/history`, {
      headers: {
        Authorization: token
      }
    });
    
    if (res.data.status === 'success') {
      //* if the API responds with a success, save the data in the 'history' state
      setHistory(res.data.history);
    }
  }

  //* this function fires when the user changes their preffered marker color in the theme menu
  function handleMarkerColorChange(evt) {
    evt.preventDefault();

    //* save the data in the parent component's state via the inherited setter function
    if (typeof props.fParentSetMapMarkerColor === 'function') {
      props.fParentSetMapMarkerColor(evt.target.value);    
    }
  }
  
  //* this function fires when the user changes their preffered detail color in the theme menu
  function handleDetailsColorChange(evt) {
    evt.preventDefault();

    //* save the data in the parent component's state via the inherited setter function
    if (typeof props.fParentSetMapDetailsColor === 'function') {
      props.fParentSetMapDetailsColor(evt.target.value);
    }
  }

  //* fetch history on page render
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <nav className={props.className}>
      <div className="flex items-center justify-around w-full">
        <div>
          <ModalButton effect={fetchHistory} modalLeft='left-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <div className='flex flex-col items-center justify-between gap-8 px-10 py-6 bg-white rounded-md'>
              <span className='block text-lg' ref={refAccountSpan}> Fetching account details... </span>

              <StyledButton className='bg-blue-600' onClick={logOut} text='Log out'/>
            </div>
          </ModalButton>
        </div>

        <div>
          <div className="flex items-center gap-4">
            <ModalButton ref={refHistory}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>

              <div className='flex flex-col items-center justify-between gap-8 px-6 py-10 overflow-x-hidden overflow-y-auto bg-white rounded-md max-h-64'>
                <span className='block text-lg'> Search History </span>

                <div className="flex flex-col items-center gap-6">
                  {
                    history.reverse()
                    .map(item => {
                      return (
                        <div key='' className='flex items-center justify-between gap-6 pb-2 border-b border-zinc-300 hover:cursor-pointer'>
                          <span className='block text-md'> {item.origin} </span>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>

                          <span className='block text-md'> {item.destination} </span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </ModalButton>

            
            <ModalButton>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

              <div className='flex flex-col items-center justify-between gap-8 px-6 py-10 overflow-x-hidden overflow-y-auto bg-white rounded-md max-h-64'>
                <span className='block text-lg'> Settings </span>

                <ColorInput
                  pText='Map marker color'
                  pValue={props.pParentMarkerColor}
                  fParentHandleChangeEvent={handleMarkerColorChange}
                />

                <ColorInput
                  pText='Detailed view color'
                  pValue={props.pParentMapDetailsColor}
                  fParentHandleChangeEvent={handleDetailsColorChange}
                />
              </div>
            </ModalButton>
            
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
