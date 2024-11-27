import { useStateController } from "../helpers/StateProvider";
import eraser from "../assets/eraser.svg";
import filled_eraser from "../assets/filled_eraser.svg";
import { useState } from "react";

function ColorPalette({ controls }: { controls: React.RefObject<any> }) {
  const { colors, currColorRef, setCurrColor, setIsBuildModeRef } =
    useStateController();
  const [selectedColor, setSelectedColor] = useState<string | null>(
    currColorRef.current
  );

  return (
    <div className="ui-element color-pallete invisible lg:visible">
      {colors.map((color) => {
        const isSelected = selectedColor === color;
        return (
          <div
            className="color-option"
            key={color} // Add a key for each element
            onClick={() => {
              setCurrColor(color);
              setSelectedColor(color);
              setIsBuildModeRef(true);
              if (controls) controls.current.enableRotate = false;
            }}
            style={{
              backgroundColor: color !== "transparent" ? color : "initial",
              backgroundImage:
                color !== "transparent"
                  ? `none`
                  : !isSelected
                  ? "url(" + eraser + ")"
                  : "url(" + filled_eraser + ")",
              backgroundSize: "contain",
              width: isSelected && color !== "transparent" ? "24px" : "30px",
              height: isSelected && color !== "transparent" ? "24px" : "30px",
              outline: isSelected
                ? `3px solid ${color !== "transparent" ? color : "#000000CC"}`
                : "none",
              borderRadius: "5px",
              outlineOffset: "3px",
              margin:
                isSelected && color !== "transparent"
                  ? " 1.1875rem 0.6875rem"
                  : "1rem 0.5rem",
              boxShadow: color !== "transparent" ? "null" : "none",
            }}
          ></div>
        );
      })}
    </div>
  );
}

export default ColorPalette;
