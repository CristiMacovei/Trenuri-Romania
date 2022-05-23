import React from 'react'

const LoginStyledInput = (props) => {
  return (
    <>
      <input placeholder={props.placeholder} name={props.name} autoComplete='off' autoSave='off' className='px-8 py-2 text-xl font-semibold text-white bg-transparent border-2 border-white rounded-full outline-none focus:outline-none hover:bg-gray-500/10' type={props.type} />
    </>
  )
}

export default LoginStyledInput