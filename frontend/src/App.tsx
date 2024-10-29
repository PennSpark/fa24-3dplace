import { useState } from "react";
import "./App.css";
import Canvas from "./Canvas";
import ColorPalette from "./components/ColorPalette";
import Toolbar from "./components/Toolbar";

function App() {
  const usedColors: string[] = [
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

  const [currColor, setCurrColor] = useState<string>("#000000");

  function setColor(arg: string) {
    setCurrColor(arg);
  }
  return (
    <>
      {/* <ColorPalette colors={usedColors} setColor={setColor} /> */}
      <Toolbar />
      <Canvas />
    </>
  );
}

export default App;
