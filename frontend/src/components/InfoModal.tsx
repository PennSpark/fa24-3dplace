import { useEffect } from "react";
import logo from "../assets/penn_place_logo.png";
import exit from "../assets/cancel_icon.svg";

interface InfoModalProps {
  handleClose: () => void;
  setIsMouseOverUI: (flag: boolean) => void;
}

export default function InfoModal({
  handleClose,
  setIsMouseOverUI,
}: InfoModalProps) {
  useEffect(() => {
    // on init toggle on mouseOverUI
    // bug: still places 1 block on first click
    setIsMouseOverUI(true);
  });

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const modal = document.getElementById("info-modal");
      if (modal && !modal.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleClose]);

  return (
    <div className="fixed ui-element inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
      <div
        id="info-modal"
        className="relative mx-7 bg-[#F1FAFF]  rounded-xl shadow-lg p-6 max-w-sm w-full text-center"
      >
        <div
          className="absolute top-5 left-5 cursor-pointer"
          onClick={handleClose}
        >
          <img src={exit} alt="exit" className="scale-125" />
        </div>
        <img src={logo} alt="logo" className="mx-auto mb-4 w-12" />
        <h3 className="text-lg font-medium text-gray-900">
          For the best experience, please use a laptop or desktop device.
        </h3>
      </div>
    </div>
  );
}
