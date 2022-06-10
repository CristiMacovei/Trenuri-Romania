import { useRef, useEffect } from 'react'

import { removeCookies, getCookie } from 'cookies-next'

import ModalButton from './ModalButton'
import axios from 'axios'

const Navbar = (props) => {
  const refAccountSpan = useRef()

  function logOut() {
    removeCookies('qwe-token')

    window.location.href = '/login'
  }
 
  useEffect(() => {
    const token = getCookie('qwe-token')

    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
      token
    })
    .then(res => {
      if (res.data.status === 'success') {
        refAccountSpan.current.innerHTML = `Logged in as ${res.data.user.username}`
      }
      else {
        logOut()
      }
    })
  }, [])

  return (
    <nav className={props.className}>
      <div className="relative flex items-center justify-around w-full">
        <div>
          <ModalButton modalLeft='left-2'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <div className='flex flex-col items-center justify-between h-16 w-36 left'>
              <div>
                <span ref={refAccountSpan}> Fetching account details... </span>
              </div>

              <button className='mx-auto underline hover:cursor-pointer' onClick={logOut}>Log out</button>
            </div>
          </ModalButton>
        </div>

        <div>
          <div className="flex items-center gap-4">
            <ModalButton>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>

              <div>
                History
              </div>
            </ModalButton>

            
            <ModalButton>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

              <div>
                Settings
              </div>
            </ModalButton>
            
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar