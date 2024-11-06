import { MutableRefObject } from "react";
import { useStateController } from "../helpers/StateProvider";

interface ToggleSliderProps {
  onToggle: (isBuildMode: MutableRefObject<boolean>) => void;
}

const ToggleSlider: React.FC<ToggleSliderProps> = ({ onToggle }) => {
  const { isBuildModeRef } = useStateController();

  const handleToggle = () => {
    isBuildModeRef.current = !isBuildModeRef.current;
    onToggle(isBuildModeRef);
  };

  return (
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="toggle"
        id="toggle"
        className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer"
        checked={isBuildModeRef.current}
        onChange={handleToggle}
      />
      <label
        htmlFor="toggle"
        className="toggle-label block overflow-hidden h-4 rounded-full bg-gray-300 cursor-pointer"
      >
        <span className="toggle-label-text text-xs font-medium text-gray-600"></span>
      </label>
      <div className="toggle-knob absolute top-0 left-0 w-4 h-4 bg-white rounded-full transition duration-200 ease-in"></div>
      <span className="text-xs font-medium text-gray-600 ml-2">{isBuildModeRef.current ? 'Build' : 'Move'}</span>
    </div>
  );
};

export default ToggleSlider;