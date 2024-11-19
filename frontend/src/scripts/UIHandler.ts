export function handleUI(setIsMouseOverUI: any) {
  const uiElementRefs = document.querySelectorAll(".ui-element");

  const handleMouseEnter = () => {
    setIsMouseOverUI(true);
  };
  const handleMouseLeave = () => {
    setIsMouseOverUI(false);
  };

  // attach event listeners to each UI element
  uiElementRefs.forEach((elt) => {
    elt.addEventListener("mouseenter", handleMouseEnter);
    elt.addEventListener("mouseleave", handleMouseLeave);
  });
}
