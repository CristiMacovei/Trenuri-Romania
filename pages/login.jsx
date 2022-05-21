import { useRef } from 'react'
import axios from 'axios'
import { setCookies } from 'cookies-next'

const LoginPage = () => {
  const form = useRef()

  async function handleSubmit(evt) {
    evt.preventDefault()

    const fData = new FormData(form.current)

    const username = fData.get('username')
    const password = fData.get('password')

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
    <div>
      <form ref={form} onSubmit={handleSubmit}>
        <input type="text" name="username" />
        <input type="password" name="password" />

        <input type="submit" value="MATA" />
      </form>
    </div>
  )
}

export default LoginPage