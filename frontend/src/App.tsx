import "./App.css";
import Canvas from "./Canvas";
import ColorPalette from "./components/ColorPalette";
import Toolbar from "./components/Toolbar";

function App() {
  return (
    <>
      <ColorPalette />
      <Toolbar />
      <Canvas />
    </>
  );
}

export default App;
