import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main scrollable container to top
    const scrollableElement = document.getElementById("scrollable-content");
    if (scrollableElement) {
      scrollableElement.scrollTo(0, 0);
    }
    // Also scroll window as a fallback
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
