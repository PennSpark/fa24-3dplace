import {
  FaHome,
  FaSearchPlus,
  FaSearchMinus,
  FaArrowsAlt,
  FaUndo,
} from "react-icons/fa";
import { useState } from "react";
import { useStateController } from "../helpers/StateProvider";

function Toolbar() {
  // toolbar button functionality
  const MAX_ZOOM_IN_STEPS = 50;
  let zoomSteps = 0;

  const [isPanning, setIsPanning] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const { controls } = useStateController();

  const handleResetCamera = () => {
    controls.reset();
  };

  const handleZoomIn = () => {
    const zoomIn = () => {
      controls._dollyIn(0.99);
      zoomSteps++;
      if (zoomSteps < MAX_ZOOM_IN_STEPS) {
        requestAnimationFrame(zoomIn);
      } else {
        zoomSteps = 0;
      }
    };
    zoomIn();
  };

  const handleZoomOut = () => {
    const zoomOut = () => {
      controls._dollyOut(0.99);
      zoomSteps++;
      if (zoomSteps < MAX_ZOOM_IN_STEPS) {
        requestAnimationFrame(zoomOut);
      } else {
        zoomSteps = 0;
      }
    };
    zoomOut();
  };

  return (
    <div className="toolbar ui-element">
      <button
        title="Reset Camera"
        onClick={handleResetCamera}
        className="mr-2 toolbar-button"
      >
        <FaHome className="text-black" />
      </button>
      <button
        title="Zoom In"
        onClick={handleZoomIn}
        className="mr-2 toolbar-button"
      >
        <FaSearchPlus className="text-black" />
      </button>
      <button
        title="Zoom Out"
        onClick={handleZoomOut}
        className="mr-2 toolbar-button"
      >
        <FaSearchMinus className="text-black" />
      </button>
    </div>
  );
}

export default Toolbar;
