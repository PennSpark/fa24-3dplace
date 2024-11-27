import { useStateController } from "../helpers/StateProvider";
import { useState } from "react";
import EraserSVG from "./EraserSVG";

function ColorPalette({ controls }: { controls: React.RefObject<any> }) {
  const { colors, currColorRef, setCurrColor, setIsBuildModeRef } =
    useStateController();
  const [, setSelectedColor] = useState<string | null>(currColorRef.current);

  const style = (color: string, isSelected: boolean) => {
    return {
      backgroundColor: color !== "transparent" ? color : "initial",
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
    };
  };

  const handleClick = (color: string) => {
    setCurrColor(color);
    setSelectedColor(color);
    setIsBuildModeRef(true);
    if (controls) controls.current.enableRotate = false;
  };

  return (
    <div className="ui-element color-pallete invisible lg:visible">
      {colors.map((color) => {
        const isSelected = currColorRef.current === color;
        return color !== "transparent" ? (
          <div
            className="color-option"
            key={color}
            onClick={() => handleClick(color)}
            style={style(color, isSelected)}
          />
        ) : (
          <div
            onClick={() => handleClick(color)}
            style={style(color, isSelected)}
            className="flex justify-center items-center cursor-pointer"
          >
            <EraserSVG
              sizeOffset={0}
              isFilled={color === "transparent" && isSelected}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ColorPalette;
