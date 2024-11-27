import { FaArrowsAlt } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { useStateController } from "../helpers/StateProvider";

function ModeSlider({ isSpamming }: { isSpamming: boolean }) {
  const { controls, setIsBuildModeRef, mode } = useStateController();

  const toggleMode = () => {
    const newMode = !mode;
    setIsBuildModeRef(newMode);
    controls.enableRotate = !newMode;
  };

  return (
    <div className="mode-slider ui-element bottom-6 lg:top-4">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={mode}
          onChange={toggleMode}
          disabled={isSpamming}
        />
        <span className="slider">
          <span className="slider-circle">
            {mode ? <FiBox /> : <FaArrowsAlt />}
          </span>
          {mode ? (
            <span className="slider-text-build">Build</span>
          ) : (
            <span className="slider-text-move">Move</span>
          )}
        </span>
      </label>
    </div>
  );
}

export default ModeSlider;
