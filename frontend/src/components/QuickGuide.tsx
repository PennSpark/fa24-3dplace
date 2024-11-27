import { useState } from "react";
import { FaChevronDown, FaArrowsAlt } from "react-icons/fa";
import { FiBox } from "react-icons/fi";

export function QuickGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="quick-guide invisible lg:visible">
      <button
        className={`quick-guide-button ${
          isOpen
            ? "quick-guide-button-open"
            : "quick-guide-button-closed ui-element"
        }`}
        onClick={toggleDropdown}
      >
        <span className="quick-guide-text">Quick Guide</span>
        <FaChevronDown
          className={`quick-guide-icon ${isOpen ? "rotate-up" : "rotate-down"}`}
        />
      </button>

      <div
        className={`ui-element quick-guide-dropdown ${isOpen ? "show" : ""}`}
      >
        <div className="quick-guide-item">
          <span className="quick-guide-item-label">Place:</span>
          <span className="quick-guide-item-description">
            build mode <FiBox className="quick-guide-item-icon" /> + left click
          </span>
        </div>
        <div className="quick-guide-item">
          <span className="quick-guide-item-label">Rotate:</span>
          <span className="quick-guide-item-description">
            move mode <FaArrowsAlt className="quick-guide-item-icon" /> + left
            click
          </span>
        </div>
        <div className="quick-guide-item">
          <span className="quick-guide-item-label">Move:</span>
          <span className="quick-guide-item-description">
            double (right) click | arrow keys
          </span>
        </div>
        <div className="quick-guide-item">
          <span className="quick-guide-item-label">Zoom:</span>
          <span className="quick-guide-item-description">
            pinch in-out | scroll wheel
          </span>
        </div>
      </div>
    </div>
  );
}
