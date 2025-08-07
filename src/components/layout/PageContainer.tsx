import React from "react";
import { Container, ContainerProps, Box } from "@mui/material";
import { useNavbarHeight } from "../../hooks/useNavbarHeight";

interface PageContainerProps extends Omit<ContainerProps, "sx"> {
  /**
   * Additional spacing below the navbar (in pixels)
   * @default 20
   */
  additionalSpacing?: number;
  /**
   * Whether to add full viewport min-height
   * @default true
   */
  fullHeight?: boolean;
  /**
   * Background color for the page
   * @default "#fff"
   */
  backgroundColor?: string;
  /**
   * Custom sx props that will be merged with the navbar spacing
   */
  sx?: ContainerProps["sx"];
  /**
   * Whether to use precise navbar height (no additional spacing)
   * @default false
   */
  preciseFit?: boolean;
}

/**
 * PageContainer component that automatically handles navbar spacing
 * Ensures content is properly positioned below the fixed navbar across all breakpoints
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  additionalSpacing = 20,
  fullHeight = true,
  backgroundColor = "#fff",
  sx = {},
  preciseFit = false,
  ...containerProps
}) => {
  const { navbarHeight, marginTop, paddingTop } = useNavbarHeight();

  // Calculate the appropriate top spacing
  const getTopSpacing = () => {
    if (preciseFit) {
      return paddingTop; // Exact navbar height
    }

    // Custom spacing: navbar height + additional spacing
    return {
      xs: `${navbarHeight + additionalSpacing}px`,
      sm: `${navbarHeight + additionalSpacing + 10}px`,
      md: `${navbarHeight + additionalSpacing + 20}px`,
      lg: `${navbarHeight + additionalSpacing + 30}px`,
      xl: `${navbarHeight + additionalSpacing + 40}px`,
    };
  };

  const containerSx = {
    backgroundColor: fullHeight ? backgroundColor : undefined,
    minHeight: fullHeight ? "100vh" : undefined,
    ...sx,
  };

  const innerSx = {
    mt: getTopSpacing(),
    ...sx,
  };

  return fullHeight ? (
    <Box sx={containerSx}>
      <Container {...containerProps} sx={innerSx}>
        {children}
      </Container>
    </Box>
  ) : (
    <Container {...containerProps} sx={innerSx}>
      {children}
    </Container>
  );
};

export default PageContainer;
