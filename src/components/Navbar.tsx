import React, { useState, useEffect } from "react";
import {
  AppBar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  IconButton,
  Drawer,
  Theme,
  useMediaQuery,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import jpLogo from "../assets/images/JPLogo.png";
import { useCart } from "../contexts/CartContext";
import CartDrawer from "./Cart/CartDrawer";

const MotionIcon = motion.div;
const MotionStack = motion.create(Stack as any);
const MotionBox = motion.create(Box as any);

const topElementsVariants = {
  initial: {
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  scrolled: {
    y: 12,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const menuVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
};

export const iconHoverVariants = {
  initial: {
    scale: 1,
    y: 0,
    color: "#ffffff",
  },
  hover: {
    scale: 1.1,
    y: -2,
    color: "#e0e0e0",
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export interface SocialLink {
  platform: string;
  icon: React.ReactNode;
  url: string;
}

// Inside the component, add this array of social links
export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    icon: <InstagramIcon sx={{ cursor: "pointer" }} />,
    url: "https://www.instagram.com/jpperformancecarsltd/?hl=en-gb",
  },
  {
    platform: "facebook",
    icon: <FacebookIcon sx={{ cursor: "pointer" }} />,
    url: "https://www.facebook.com/jpperformancecars/?locale=en_GB",
  },
];

// Add navigation items with their dropdown options
const navItems = [
  {
    label: "HOME",
    dropdownItems: [],
    link: "/",
  },
  {
    label: "SERVICES",
    dropdownItems: [],
    link: "/services",
  },
  {
    label: "DIAGNOSTIC",
    dropdownItems: [],
    link: "/diagnostic",
  },
  {
    label: "ABOUT",
    dropdownItems: [
      { label: "Our Story", link: "/about/story" },
      { label: "Team", link: "/about/team" },
    ],
  },
  {
    label: "BLOG",
    dropdownItems: [],
    link: "/blog",
  },
  {
    label: "CONTACT",
    dropdownItems: [], // No dropdown for contact
    link: "/contact",
  },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("lg")
  );

  const handleNavigation = (item: (typeof navItems)[0]) => {
    if (item.link) {
      navigate(item.link);
      // Close mobile menu if open
      setMobileMenuOpen(false);
      // Close any open dropdowns
      handleClose(item.label);
    }
  };

  // Add state for managing dropdown menus
  const [anchorEl, setAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    label: string
  ) => {
    setAnchorEl({ ...anchorEl, [label]: event.currentTarget });
  };

  const handleClose = (label: string) => {
    setAnchorEl({ ...anchorEl, [label]: null });
  };

  const handleDropdownNavigation = (dropdownItem: {
    label: string;
    link: string;
  }) => {
    navigate(dropdownItem.link);
    handleClose("ABOUT");
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setAnchorEl({});
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "black",
        transition: "all 0.3s ease-in-out",
        height: isMobile ? "90px" : isScrolled ? "90px" : "205px",
        boxShadow: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: isMobile ? "0" : isScrolled ? "0 24px" : "10px 24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: isMobile ? 0 : isScrolled ? 0 : 3,
              mb: isMobile ? 0 : isScrolled ? -4 : 3,
              height: isMobile ? "80px" : isScrolled ? "60px" : "auto",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {!isMobile && (
              <MotionStack
                direction="row"
                spacing={2}
                animate={isScrolled ? "scrolled" : "initial"}
                variants={topElementsVariants}
              >
                {socialLinks.map(({ platform, icon, url }) => (
                  <MotionIcon
                    key={platform}
                    variants={iconHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(url, "_blank")}
                  >
                    {icon}
                  </MotionIcon>
                ))}
              </MotionStack>
            )}

            <Box
              component="img"
              src={jpLogo}
              onClick={() => navigate("/")}
              alt="JP Performance Cars"
              sx={{
                height: isScrolled || isMobile ? "55px" : "70px",
                width: "auto",
                transition: "all 0.3s ease-in-out",
                opacity: isMobile ? 1 : isScrolled ? 0 : 1,
                margin: isMobile ? "0 auto" : "0",
                cursor: "pointer",
              }}
            />

            {!isMobile && (
              <MotionBox
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
                animate={isScrolled ? "scrolled" : "initial"}
                variants={topElementsVariants}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhoneIcon
                    sx={{
                      "@media (max-width: 1024px)": {
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      "@media (max-width: 1024px)": {
                        fontSize: "0.7rem",
                      },
                    }}
                  >
                    +44 (0)7391 710867
                  </Typography>
                </Box>

                {/* Cart Icon */}
                <IconButton
                  onClick={() => setCartOpen(true)}
                  sx={{
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <Badge badgeContent={state.itemCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </MotionBox>
            )}
          </Box>

          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "35px",
                mt: "auto",
                paddingBottom: "15px",
                "& .MuiButton-root": {
                  fontWeight: 700,
                  fontFamily: "'Montserrat', sans-serif",
                },
              }}
            >
              {navItems.map((item) => (
                <Box key={item.label}>
                  <Button
                    color="inherit"
                    endIcon={
                      item.dropdownItems.length > 0 && <KeyboardArrowDownIcon />
                    }
                    onClick={(e) => {
                      if (item.dropdownItems.length > 0) {
                        handleClick(e, item.label);
                      } else {
                        handleNavigation(item);
                      }
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                  {item.dropdownItems.length > 0 && (
                    <Menu
                      disableScrollLock={true}
                      anchorEl={anchorEl[item.label]}
                      open={Boolean(anchorEl[item.label])}
                      onClose={() => handleClose(item.label)}
                      PaperProps={{
                        sx: {
                          backgroundColor: "black",
                          color: "white",
                          mt: 1,
                          minWidth: 180,
                          "& .MuiMenuItem-root": {
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "0.9rem",
                            letterSpacing: "1px",
                            py: 1.5,
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            },
                          },
                        },
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      {item.dropdownItems.map((dropdownItem) => (
                        <MenuItem
                          key={
                            typeof dropdownItem === "string"
                              ? dropdownItem
                              : dropdownItem.label
                          }
                          onClick={() => {
                            if (typeof dropdownItem === "string") {
                              handleClose(item.label);
                            } else {
                              handleDropdownNavigation(dropdownItem);
                            }
                          }}
                        >
                          {typeof dropdownItem === "string"
                            ? dropdownItem
                            : dropdownItem.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>

      {isMobile && (
        <>
          <Box
            sx={{
              position: "absolute",
              right: 20,
              top: 20,
              display: "flex",
              gap: 1,
            }}
          >
            {/* Cart Icon for Mobile */}
            <IconButton
              sx={{
                color: "white",
              }}
              onClick={() => setCartOpen(true)}
            >
              <Badge badgeContent={state.itemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton
              sx={{
                color: "white",
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            PaperProps={{
              sx: {
                width: "100%",
                backgroundColor: "black",
                opacity: 0.95,
                color: "white",
                textAlign: "center",
              },
            }}
          >
            <IconButton
              sx={{
                color: "white",
                alignSelf: "flex-end",
                mb: 2,
                padding: "20px",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <CloseIcon />
            </IconButton>

            <MotionBox
              initial="closed"
              animate="open"
              variants={menuVariants}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
              }}
            >
              {navItems.map((item) => (
                <Box key={item.label} sx={{ width: "100%" }}>
                  <Button
                    color="inherit"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "1.2rem",
                      py: 2,
                      width: "100%",
                      textAlign: "center",
                    }}
                    endIcon={
                      item.dropdownItems.length > 0 && <KeyboardArrowDownIcon />
                    }
                    onClick={(e) => {
                      if (item.dropdownItems.length > 0) {
                        handleClick(e, item.label);
                      } else {
                        handleNavigation(item);
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                  {item.dropdownItems.length > 0 && (
                    <Menu
                      anchorEl={anchorEl[item.label]}
                      open={Boolean(anchorEl[item.label])}
                      onClose={() => handleClose(item.label)}
                      PaperProps={{
                        sx: {
                          backgroundColor: "black",
                          color: "white",
                          left: "0 !important",
                          right: "0 !important",
                          width: "100%",
                          maxWidth: "none",
                          "& .MuiList-root": {
                            padding: 0,
                          },
                          "& .MuiMenuItem-root": {
                            fontFamily: "'Montserrat', sans-serif",
                            fontSize: "1.1rem",
                            textAlign: "center",
                            justifyContent: "center",
                            py: 2,
                            width: "100%",
                          },
                        },
                      }}
                      MenuListProps={{
                        sx: {
                          width: "100%",
                        },
                      }}
                      sx={{
                        "& .MuiMenu-paper": {
                          width: "100%",
                          maxWidth: "100%",
                          left: "0 !important",
                          right: "0 !important",
                        },
                      }}
                    >
                      {item.dropdownItems.map((dropdownItem) => (
                        <MenuItem
                          key={
                            typeof dropdownItem === "string"
                              ? dropdownItem
                              : dropdownItem.label
                          }
                          onClick={() => {
                            if (typeof dropdownItem === "string") {
                              handleClose(item.label);
                            } else {
                              handleDropdownNavigation(dropdownItem);
                            }
                          }}
                        >
                          {typeof dropdownItem === "string"
                            ? dropdownItem
                            : dropdownItem.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </Box>
              ))}
            </MotionBox>
          </Drawer>
        </>
      )}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          height: "6px",
          gap: "30px",
          px: "20px",
        }}
      >
        <Box sx={{ flex: 1, backgroundColor: "#006620" }} />
        <Box sx={{ flex: 1, backgroundColor: "#e8e8e8" }} />
        <Box sx={{ flex: 1, backgroundColor: "#a70a0c" }} />
      </Box>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </AppBar>
  );
};

export default Navbar;
