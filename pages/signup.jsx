import { useRef } from 'react'
import axios from 'axios'
import { setCookies } from 'cookies-next'

import Image from 'next/image'

import '../styles/LoginPage.module.css'
import LoginStyledInput from '../components/LoginStyledInput'
import StyledButton from '../components/StyledButton'

const SignupPage = () => {
  async function handleSubmit(evt) {
    evt.preventDefault()

    const fData = new FormData(evt.target)

    const username = fData.get('username')
    const password = fData.get('password')

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
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
    <div className='relative w-screen h-screen overflow-auto bg'>
      <Image src='/background.jpg' className='object-cover object-center' alt='background' layout='fill' />
      <div className='relative flex flex-col items-center justify-center h-full z-1'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col items-center gap-8'>
            <div className="flex flex-col items-center gap-4">
              <LoginStyledInput name='username' type='text' placeholder='Enter username'/>
              <LoginStyledInput name='password' type='password' placeholder='Enter password'/>
            </div>
            
            <div className="mx-auto">
              <StyledButton text='Signup'/>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage