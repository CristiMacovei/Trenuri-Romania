import { useRef } from 'react'
import axios from 'axios'
import { setCookies } from 'cookies-next'

import '../styles/LoginPage.module.css'
import LoginStyledInput from '../components/LoginStyledInput'
import StyledButton from '../components/StyledButton'

const LoginPage = () => {
  const form = useRef()

  async function handleSubmit(evt) {
    evt.preventDefault()

    const fData = new FormData(evt.target)

    const username = fData.get('username')
    const password = fData.get('password')

    console.log(username, password)

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      username,
      password
    })

    console.log(response.data)
    if (response.data.status === 'success') {
      setCookies('qwe-token', response.data.user.token)

      window.location.href = '/'
    }
  }

  return (
    <div className='w-screen h-screen overflow-auto bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800'>
      <div className='flex flex-col items-center justify-center h-full'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col items-center gap-8'>
            <div className="flex flex-col items-center gap-4">
              <LoginStyledInput name='username' type='text' placeholder='Enter username'/>
              <LoginStyledInput name='password' type='password' placeholder='Enter password'/>
            </div>
            
            <div className="mx-auto">
              <StyledButton text='Login'/>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage