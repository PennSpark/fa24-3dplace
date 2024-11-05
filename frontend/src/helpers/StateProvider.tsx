import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  MutableRefObject,
} from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";

interface StateControllerContextType {
  currColorRef: MutableRefObject<string>;
  setCurrColor: (color: string) => void;
  controls: any;
  setControls: (controls: any) => void;
}

const StateControllerContext = createContext<
  StateControllerContextType | undefined
>(undefined);

export const StateControllerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // voxel color
  const currColorRef = useRef<string>("#000000");
  const setCurrColor = (color: string) => {
    currColorRef.current = color; // update the ref value
  };

  // camera controls
  const [controls, setControls] = useState<OrbitControls | null>(null);

  return (
    <StateControllerContext.Provider
      value={{ currColorRef, setCurrColor, controls, setControls }}
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
