import "./App.css";
import Canvas from "./Canvas";
import { StateControllerProvider } from "./helpers/StateProvider";

function App() {
  return (
    <>
      <StateControllerProvider>
        <Canvas />
      </StateControllerProvider>
    </>
  );
}

export default App;
