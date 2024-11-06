<<<<<<< Updated upstream
import {
  FaHome,
  FaSearchPlus,
  FaSearchMinus,
  FaArrowsAlt,
  FaUndo,
} from "react-icons/fa";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useState } from "react";

function Toolbar({ controls }: { controls: OrbitControls }) {
  // toolbar button functionality
=======
import { FaHome, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { useStateController } from "../helpers/StateProvider";

function Toolbar() {

>>>>>>> Stashed changes
  const MAX_ZOOM_IN_STEPS = 50;
  let zoomSteps = 0;

<<<<<<< Updated upstream
  const [isPanning, setIsPanning] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
=======
  const { controls } = useStateController();
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  const handleTogglePan = () => {
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    setIsPanning(true);
    setIsRotating(false);
  };

  const handleToggleRotate = () => {
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.screenSpacePanning = false;
    setIsPanning(false);
    setIsRotating(true);
  };

  return (
    <div className="ui-element fixed top-2 right-2 bg-white p-4 border border-gray-300 rounded shadow-md z-50">
      <button title="Reset Camera" onClick={handleResetCamera} className="mr-2">
        <FaHome />
      </button>
      <button title="Zoom In" onClick={handleZoomIn} className="mr-2">
        <FaSearchPlus />
      </button>
      <button title="Zoom Out" onClick={handleZoomOut} className="mr-2">
        <FaSearchMinus />
      </button>
      <button
        title="Toggle Pan"
        onClick={handleTogglePan}
        className={`mr-2 ${isPanning ? "bg-blue-500" : ""}`}
      >
        <FaArrowsAlt />
      </button>
      <button
        title="Toggle Rotate"
        onClick={handleToggleRotate}
        className={`mr-2 ${isRotating ? "bg-blue-500" : ""}`}
      >
        <FaUndo />
=======
  return (
    <div className="toolbar">
      <button 
        title="Reset Camera" 
        onClick={handleResetCamera}
        className="mr-2 toolbar-button"
      >
        <FaHome className='text-black'/>
      </button>
      <button 
        title="Zoom In" 
        onClick={handleZoomIn}
        className="mr-2 toolbar-button"
      >
        <FaSearchPlus className='text-black'/>
      </button>
      <button 
        title="Zoom Out" 
        onClick={handleZoomOut}
        className="mr-2 toolbar-button"
      >
        <FaSearchMinus className='text-black'/>
>>>>>>> Stashed changes
      </button>
    </div>
  );
}

export default Toolbar;
