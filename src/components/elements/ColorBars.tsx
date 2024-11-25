import { motion } from "framer-motion";
export const ColorBars = () => {
  return (
    <motion.div
      style={{
        display: "flex",
        height: "2px",
        width: "20%",
      }}
      whileHover="hover"
      initial="initial"
      variants={{
        initial: {
          scale: 1,
        },
        hover: {
          scale: 1.2,
          transition: {
            duration: 0.3,
            ease: "easeInOut",
          },
        },
      }}
    >
      <motion.div style={{ flex: 1, backgroundColor: "#006620" }} />
      <motion.div style={{ flex: 1, backgroundColor: "#e8e8e8" }} />
      <motion.div style={{ flex: 1, backgroundColor: "#a70a0c" }} />
    </motion.div>
  );
};
