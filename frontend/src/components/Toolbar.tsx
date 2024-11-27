import { useStateController } from "../helpers/StateProvider";
import home from "../assets/home.svg";
import zoomin from "../assets/zoomin.svg";
import zoomout from "../assets/zoomout.svg";

function Toolbar() {
  // toolbar button functionality
  const MAX_ZOOM_IN_STEPS = 50;
  let zoomSteps = 0;
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
        className="mr-5 toolbar-button"
      >
        <img className="home" alt="home" src={home} />
      </button>
      <button
        title="Zoom In"
        onClick={handleZoomIn}
        className="mr-5 toolbar-button"
      >
        <img className="zoomin" alt="zoom in" src={zoomin} />
      </button>
      <button
        title="Zoom Out"
        onClick={handleZoomOut}
        className="toolbar-button"
      >
        <img className="zoomin" alt="zoom out" src={zoomout} />
      </button>
    </div>
  );
}

export default Toolbar;
