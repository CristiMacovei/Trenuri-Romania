import React from 'react'

export default function color(props) {

  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <span>{props.pText}</span>
        <input type="color" value={typeof props.pValue === 'string' ? props.pValue : '#ff0000'} onChange={props.fParentHandleChangeEvent}/>
      </div>
    </>
  )
}
