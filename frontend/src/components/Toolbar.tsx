import { useStateController } from "../helpers/StateProvider";
import home from "../assets/home.svg";
import zoomin from "../assets/zoomin.svg";
import zoomout from "../assets/zoomout.svg";
import info from "../assets/info.svg";
import bucket from "../assets/bucket.svg";
import BucketSVG from "./BucketSVG";

interface ToolbarProps {
  setShowInfoModal: (open: boolean) => void;
  setShowPaletteModal: (open: boolean) => void;
}

function Toolbar({ setShowInfoModal, setShowPaletteModal }: ToolbarProps) {
  const { currColorRef } = useStateController();

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
    <>
      <div className="toolbar ui-element invisible lg:visible">
        <button
          title="Reset Camera"
          onClick={handleResetCamera}
          className="mr-5 toolbar-button"
        >
          <img className="home ml-[1px]" alt="home" src={home} />
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

      {/* mobile buttons */}
      <div className="fixed visible lg:invisible">
        <button
          title="Home"
          onClick={handleResetCamera}
          className="toolbar-fab ui-element fixed bottom-7 lg:top-7 left-7"
        >
          <img className="home ml-[1px] scale-125" alt="home" src={home} />
        </button>
        <button
          title="Info"
          onClick={() => {
            setShowInfoModal(true);
          }}
          className="toolbar-button-mobile ui-element fixed top-7 right-7"
        >
          <img className="info scale-125" alt="info" src={info} />
        </button>
        <button
          title="Bucket"
          onClick={() => {
            setShowPaletteModal(true);
          }}
          className="toolbar-fab ui-element fixed bottom-7 right-7"
        >
          <BucketSVG color={currColorRef.current} />
        </button>
      </div>
    </>
  );
}

export default Toolbar;
