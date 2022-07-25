//* this component is used in the settings menu, when the user selects their desired colors for the map markers and detailed views
const ColorInput = (props) => {
  return (
    <>
      <div className="flex items-center justify-center gap-3">
        <span>{props.pText}</span>
        <input type="color" value={typeof props.pValue === 'string' ? props.pValue : '#ff0000'} onChange={props.fParentHandleChangeEvent}/>
      </div>
    </>
  )
}

export default ColorInput;