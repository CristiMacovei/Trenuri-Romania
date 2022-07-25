//* import axios for making requests to the backend server
import axios from 'axios';

//* import the cookie handling functions provided by next to store the auth token in the cookies
import { setCookies } from 'cookies-next';

//* import the components from next
import Image from 'next/image'
import Link from 'next/link'

//* import custom styled components
import LoginStyledInput from '../components/LoginStyledInput'
import StyledButton from '../components/StyledButton'

const SignupPage = () => {
  //* this function handles the sign up form submission
  async function handleSubmit(evt) {
    //* prevent the default behaviour of form submission
    evt.preventDefault();

    //* get user data from the FormData object
    const fData = new FormData(evt.target);

    const username = fData.get('username');
    const password = fData.get('password');

    //* send a request to the /signup route
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
      username,
      password
    });

    //* for debugging purposes
    console.log('Attempting sign up request', username, password, response.data);

    //* if the response is successful, save the token in a cookie and redirect to the home page
    if (response.data.status === 'success') {
      setCookies('qwe-token', response.data.user.token);

      window.location.href = '/';
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

            <div>
              <Link href='/login'>
                <span className='text-white underline hover:cursor-pointer'>
                  Already have an account? Log in instead!
                </span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;