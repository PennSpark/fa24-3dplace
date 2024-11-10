import { useState } from "react";
import "./App.css";
import Canvas from "./Canvas";
import { StateControllerProvider } from "./helpers/StateProvider";
import WelcomeScreen from "./components/WelcomeScreen";

function App() {
  const [username, setUsername] = useState("");

  return username ? (
    <StateControllerProvider>
      <Canvas username={username} />
    </StateControllerProvider>
  ) : (
    <WelcomeScreen onSubmit={setUsername} />
  );
}

export default App;
