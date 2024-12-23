import React, { useEffect, useState } from "react";
import { useStateController } from "../helpers/StateProvider";
import confirm from "../assets/mdi_tick.svg";
import EraserSVG from "./EraserSVG";

interface PaletteModalProps {
  handleClose: () => void;
  setIsMouseOverUI: (flag: boolean) => void;
  controls: React.RefObject<any>;
}

function PaletteModal({
  handleClose,
  setIsMouseOverUI,
  controls,
}: PaletteModalProps) {
  const { colors, currColorRef, setCurrColor, setIsBuildModeRef } =
    useStateController();
  const [, setSelectedColor] = useState<string | null>(currColorRef.current);

  const style = (color: string, isSelected: boolean) => {
    return {
      backgroundColor: color !== "transparent" ? color : "initial",
      backgroundSize: "contain",
      width: isSelected && color !== "transparent" ? "44px" : "50px",
      height: isSelected && color !== "transparent" ? "44px" : "50px",
      outline: isSelected
        ? `6px solid ${color !== "transparent" ? color : "#000000CC"}`
        : "none",
      borderRadius: "5px",
      outlineOffset: "4px",
      margin: isSelected && color !== "transparent" ? "1.1875rem" : "1rem ",
      boxShadow:
        color !== "transparent"
          ? "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
          : "none",
    };
  };

  const handleClick = (color: string) => {
    setCurrColor(color);
    setSelectedColor(color);
    setIsBuildModeRef(true);
    if (controls) controls.current.enableRotate = false;
  };

  useEffect(() => {
    // on init toggle on mouseOverUI
    // bug: still places 1 block on first click
    setIsMouseOverUI(true);
  });

  return (
    <div className="fixed bg-white w-full h-full px-6 z-50">
      <div className="flex flex-col h-full justify-center place-items-center">
        <div className="flex flex-row justify-center items-center flex-wrap">
          {colors.map((color) => {
            const isSelected = currColorRef.current === color;
            return color !== "transparent" ? (
              <div
                key={color}
                onClick={() => {
                  handleClick(color);
                }}
                style={style(color, isSelected)}
              ></div>
            ) : (
              <div
                onClick={() => handleClick(color)}
                style={style(color, isSelected)}
                className="flex justify-center items-center cursor-pointer"
              >
                <EraserSVG
                  sizeOffset={15}
                  isFilled={color === "transparent" && isSelected}
                />
              </div>
            );
          })}
        </div>
        <button
          className="bg-[#EFEFEF] rounded-full mt-10 py-2 px-8 hover:bg-[#F2F2F2] transition confirm-btn shadow-md"
          onClick={handleClose}
        >
          <img src={confirm} alt="confirm" />
        </button>
      </div>
    </div>
  );
}

export default PaletteModal;
