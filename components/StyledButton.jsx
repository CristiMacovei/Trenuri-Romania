import React from 'react'

const StyledButton = (props) => {
  return (
    <input type='submit' className={props.className + ' px-8 py-2 text-xl font-semibold text-white bg-transparent border-2 border-white rounded-full hover:bg-gray-500/20'} value={props.text}/>
  )
}

export default StyledButton