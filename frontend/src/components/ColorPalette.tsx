import { useStateController } from "../helpers/StateProvider";

function ColorPalette() {
  const colors: string[] = [
    "#FF1515",
    "#FF8000",
    "#FFFF33",
    "#CCFF99",
    "#00FF00",
    "#33FFFF",
    "#99CCFF",
    "#0000FF",
    "#CC00CC",
    "#CC99FF",
    "#FF33FF",
    "#FF007F",
    "#994C00",
    "#000000",
    "#FFFFFF",
  ];

  const { setCurrColor } = useStateController();

  return (
    <div className="color-pallete">
      {colors.map((color) => {
        return (
          <div
            className="color-option"
            key={color} // Add a key for each element
            onClick={() => {
              setCurrColor(color); // Call setColor on click
            }}
            style={{
              backgroundColor: color,
              padding: "10px",
              margin: "5px",
              cursor: "pointer",
              caretColor: "transparent",
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default ColorPalette;
