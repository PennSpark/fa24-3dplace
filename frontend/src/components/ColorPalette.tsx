import { useStateController } from "../helpers/StateProvider";
import eraser from "../assets/eraser.svg";
import { useState } from "react";

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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  return (
    <div className="ui-element color-pallete">
      {colors.map((color) => {
        const isSelected = selectedColor === color;
        return (
          <div
            className="color-option"
            key={color} // Add a key for each element
            onClick={() => {
              setCurrColor(color);
              setSelectedColor(color);
            }}
            style={{
              backgroundColor: color !== "transparent" ? color : "initial",
              backgroundImage:
                color === "transparent"
                  ? `url(${eraser})`
                  : "none",
              backgroundSize: "contain",
              width: isSelected ? "24px" : "30px",
              height: isSelected ? "24px" : "30px",
              outline: isSelected
                ? `3px solid ${color !== "transparent" ? color : "#000000CC"}`
                : "none",
              borderRadius: "5px", 
              outlineOffset: "3px",
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default ColorPalette;
