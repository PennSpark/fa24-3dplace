import { useStateController } from "../helpers/StateProvider";

function ColorPalette() {
  const colors: string[] = [
    "#EB1800",
    "#FF7105",
    "#FEE400",
    "#BFEF45",
    "#00CC00",
    "#166F00",
    "#241FD3",
    "#00B2FF",
    "#81F3ED",
    "#7900C3",
    "#F032E6",
    "#FFA4D1",
    "#D4852A",
    "#63300F",
    "#000000",
    "#888888",
    "#E0E0E0",
    "#FFFFFF",
    "transparent",
  ];

  const { setCurrColor } = useStateController();

  return (
    <div className="ui-element color-pallete">
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
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default ColorPalette;
