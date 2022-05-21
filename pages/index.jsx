import { useRef, useEffect } from 'react'
import { getCookie } from 'cookies-next'
import axios from 'axios'

const IndexPage = () => {

  const main = useRef()
  
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

  return (
    <div ref={main} className='hidden'>
      Nothing here lmao
    </div>
  )
}

export default IndexPage
