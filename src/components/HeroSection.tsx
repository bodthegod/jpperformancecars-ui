import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import heroVideo from "../assets/videos/HeroVideo.mp4";
import thumbnailImage from "../assets/images/video-thumbnail.jpg";

const HeroContainer = styled(Box)`
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
    height: 500px;
  }
`;

const VideoBackground = styled.video`
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: 100%;
  height: 100%;
  margin: auto;
  z-index: -1;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 100%;
    height: 500px;
    top: 0;
    min-height: 0%;
    object-fit: cover;
  }
`;

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          videoRef.current.defaultMuted = true;
          videoRef.current.muted = true;
          await videoRef.current.play();
        }
      } catch (err) {
        console.log("Video autoplay failed:", err);
      }
    };

    playVideo();
  }, []);

  return (
    <HeroContainer>
      <VideoBackground
        ref={videoRef}
        autoPlay
        playsInline
        muted
        loop
        poster={thumbnailImage}
        preload="auto"
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>
    </HeroContainer>
  );
};

export default HeroSection;
