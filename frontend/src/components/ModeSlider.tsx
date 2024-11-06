import { FaArrowsAlt } from 'react-icons/fa';
import { FiBox } from "react-icons/fi";
import { useStateController } from "../helpers/StateProvider";


function ModeSlider() {

  const { controls, isBuildModeRef } = useStateController();

  const handleBuildMode = () => {
    isBuildModeRef.current = true;
    controls.enableRotate = false;
    console.log(isBuildModeRef.current);
  };

  const handleMoveMode = () => {
    isBuildModeRef.current = false;
    controls.enableRotate = true;
    console.log(isBuildModeRef.current);
  };

  return (
    <div className="mode-slider ui-element">
      <button
        title="Build"
        onClick={handleBuildMode}
        className={`mr-2 ${isBuildModeRef.current ? "bg-blue-500" : ""}`}
      >
        <FiBox />
      </button>
      <button
        title="Move"
        onClick={handleMoveMode}
        className={`mr-2 ${!(isBuildModeRef.current) ? "bg-blue-500" : ""}`}
      >
        <FaArrowsAlt />
      </button>
    </div>
  );
}

export default ModeSlider;