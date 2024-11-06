import { FaArrowsAlt } from 'react-icons/fa';
import { FiBox } from "react-icons/fi";
import { useStateController } from "../helpers/StateProvider";
import { useState } from 'react';

function ModeSlider() {

  const { controls, isBuildModeRef } = useStateController();
  const [mode, setMode] = useState<boolean>(isBuildModeRef.current);


  const handleBuildMode = () => {
    setMode(true);
    isBuildModeRef.current = true;
    controls.enableRotate = false;
    console.log(isBuildModeRef.current);
  };

  const handleMoveMode = () => {
    setMode(false);
    isBuildModeRef.current = false;
    controls.enableRotate = true;
    console.log(isBuildModeRef.current);
  };

  const toggleMode = () => {
    console.log('toggleMode called');
    isBuildModeRef.current = !isBuildModeRef.current;
    if (isBuildModeRef.current) {
      handleBuildMode();
    } else {
      handleMoveMode();
    }
  };

  return (
    <div className="mode-slider ui-element">
      <label className="toggle-switch">
        <input type="checkbox" checked={mode} onChange={toggleMode} />
        <span className="slider">
          <span className="slider-circle">  
            {mode ? <FiBox /> : <FaArrowsAlt />}
          </span>
          {mode ? <span className="slider-text-build">Build</span> : <span className="slider-text-move">Move</span>}
          
        </span>
      </label>
    </div>
  );
}

export default ModeSlider;