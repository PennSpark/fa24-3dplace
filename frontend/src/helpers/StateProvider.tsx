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
  const currColorRef = useRef<string>("#000000");
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
  const isBuildModeRef = useRef(true);

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
