import { useState } from "react";
import "./App.css";
import Canvas from "./Canvas";
import { StateControllerProvider } from "./helpers/StateProvider";
import WelcomeScreen from "./components/WelcomeScreen";
import { SnackbarProvider } from "notistack";

function App() {
  const [username, setUsername] = useState("");

  return username ? (
    <StateControllerProvider>
      <SnackbarProvider maxSnack={1}>
        <Canvas username={username} />
      </SnackbarProvider>
    </StateControllerProvider>
  ) : (
    <WelcomeScreen onSubmit={setUsername} />
  );
}

export default App;
