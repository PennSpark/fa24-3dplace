import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  MutableRefObject,
} from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// deifne all global state variables here
interface StateControllerContextType {
  currColorRef: MutableRefObject<string>;
  setCurrColor: (color: string) => void;
  controls: any;
  setControls: (controls: any) => void;
  isMouseOverUIRef: MutableRefObject<boolean>;
  setIsMouseOverUI: (flag: boolean) => void;
  isBuildModeRef: MutableRefObject<boolean>;
  setIsBuildModeRef: (flag: boolean) => void;
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
  isServerOnlineRef: MutableRefObject<boolean>;
  setIsServerOnline: (flag: boolean) => void;
  colors: string[];
}

const StateControllerContext = createContext<
  StateControllerContextType | undefined
>(undefined);

export const StateControllerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // state variables --> shared globally with application --> be careful of triggering rerenders w/ useState
  // voxel color --> can be defined heree, but changed based on user click in colorpallete.tsx
  // and then ref.current value passed to canvas.tsx
  const currColorRef = useRef<string>("#1E1E1E");
  const setCurrColor = (color: string) => {
    currColorRef.current = color; // update the ref value
  };

  // camera controls --> can be defined here, be adjusted in toolbar.tsx
  const [controls, setControls] = useState<OrbitControls | null>(null);

  // flag to check if mouse is over UI element, if true then disable interaction w/ canvas
  const isMouseOverUIRef = useRef<boolean>(false);
  const setIsMouseOverUI = (flag: boolean) => {
    isMouseOverUIRef.current = flag; // update the ref value
  };

  // build variables
  const isBuildModeRef = useRef(true);
  const setIsBuildModeRef = (flag: boolean) => {
    isBuildModeRef.current = flag; // update the ref value
    setMode(flag); // Update the React state
  };
  const [mode, setMode] = useState<boolean>(isBuildModeRef.current);

  // update if node server is online
  const isServerOnlineRef = useRef(false);
  const setIsServerOnline = (flag: boolean) => {
    isServerOnlineRef.current = flag; // update the ref value
  };

  // all colors
  const colors: string[] = [
    "#EB1800",
    "#FF7105",
    "#FEE400",
    "#BFEF45",
    "#00CC00",
    "#166F00",
    "#00E5F0",
    "#0078FF",
    "#241FD3",
    "#5856D6",
    "#7900C3",
    "#F032E6",
    "#FFA4D1",
    "#D4852A",
    "#63300F",
    "#1E1E1E",
    "#888888",
    "#E0E0E0",
    "transparent",
  ];

  return (
    <StateControllerContext.Provider
      value={{
        currColorRef,
        setCurrColor,
        controls,
        setControls,
        isMouseOverUIRef,
        setIsMouseOverUI,
        isBuildModeRef,
        setIsBuildModeRef,
        mode,
        setMode,
        isServerOnlineRef,
        setIsServerOnline,
        colors,
      }}
    >
      {children}
    </StateControllerContext.Provider>
  );
};

export const useStateController = () => {
  const context = useContext(StateControllerContext);
  if (!context) {
    throw new Error(
      "useStateController must be used within a StateControllerProvider"
    );
  }
  return context;
};
