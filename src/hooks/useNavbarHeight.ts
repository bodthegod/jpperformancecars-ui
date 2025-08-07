import { useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

/**
 * Custom hook to calculate the current navbar height
 * This ensures page content is properly spaced below the fixed navbar
 */
export const useNavbarHeight = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate navbar height based on breakpoint and scroll state
  const getNavbarHeight = () => {
    if (isMobile) {
      return 90; // Mobile navbar is always 90px
    }
    return isScrolled ? 90 : 205; // Desktop: 205px normal, 90px scrolled
  };

  const navbarHeight = getNavbarHeight();

  // Return both the height and responsive margin-top values
  return {
    navbarHeight,
    marginTop: {
      xs: `${navbarHeight + 20}px`, // Mobile: navbar + 20px spacing
      sm: `${navbarHeight + 30}px`, // Small: navbar + 30px spacing
      md: `${navbarHeight + 40}px`, // Medium: navbar + 40px spacing
      lg: `${navbarHeight + 50}px`, // Large: navbar + 50px spacing
      xl: `${navbarHeight + 60}px`, // XL: navbar + 60px spacing
    },
    paddingTop: `${navbarHeight}px`, // Exact navbar height for precise alignment
  };
};
