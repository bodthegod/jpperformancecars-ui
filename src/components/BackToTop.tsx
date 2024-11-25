import { KeyboardArrowUp } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

const BackToTopButton = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: 40,
  right: 40,
  width: 40,
  height: 40,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  opacity: 0,
  zIndex: 1000,
  transition: "opacity 0.3s ease-in-out",
  "&.visible": {
    opacity: 1,
  },
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 50);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <BackToTopButton
      className={isVisible ? "visible" : ""}
      onClick={scrollToTop}
    >
      <KeyboardArrowUp sx={{ color: "white" }} />
    </BackToTopButton>
  );
};

export default BackToTop;
