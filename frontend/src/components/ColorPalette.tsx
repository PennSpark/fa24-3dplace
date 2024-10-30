interface colorPalleteProps{
  colors: string[]
  setColor: (arg: string) => void
}

function ColorPalette({colors = [], setColor}: colorPalleteProps) {
  return (<div className="color-pallete">
      {colors.map((color) => {
        return (<div
          className="color-option"
          key={color} // Add a key for each element
          onClick={() => setColor(color)} // Call setColor on click
          style={{ backgroundColor: color, padding: '10px', margin: '5px', cursor: 'pointer' }}> </div>)
      })}
  </div>
  );
}

export default ColorPalette;
