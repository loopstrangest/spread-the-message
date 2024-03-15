import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { toPng } from "html-to-image";
import gifshot from "gifshot";
import "../styles.css";
import StyledButton from "./StyledButton";
import { calculateFontSize } from "../utilities/calculateFontSize";
import { Check } from "@mui/icons-material";
import {
  GIF_SIZE,
  ANIMATION_DURATION_S,
  ANIMATION_DURATION_MS,
} from "../constants";
import "animate.css";

interface WordGIFProps {
  font?: string;
  words?: string[];
  textColor?: string;
  backgroundColors: string[];
  gradientDirection: string;
  animation?: string;
  isDownloading?: boolean;
  setIsDownloading: (isDownloading: boolean) => void;
  handleAddWord: () => void;
}

interface GifShotResult {
  error: boolean;
  errorCode?: string;
  errorMsg?: string;
  image: string; // Assuming 'image' is a string URL to the generated GIF
}

const WordGIF: React.FC<WordGIFProps> = ({
  font,
  words = ["", "", ""],
  animation = "fade-in-out",
  textColor,
  backgroundColors,
  gradientDirection,
  isDownloading,
  setIsDownloading,
  handleAddWord,
}) => {
  const frameRate = 60;
  const captureLength = ANIMATION_DURATION_MS;
  const captureInterval = 1000 / frameRate;
  const [fontSize, setFontSize] = useState("36px");
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const fontSize = calculateFontSize(words);
    setFontSize(fontSize);
  }, [words]);

  const captureFrames = async (
    elementId: string,
    duration: number,
    frameRate: number
  ) => {
    const millisecondsPerSecond = 1000;
    setIsDownloading(true);
    const frames: string[] = [];
    const element = document.getElementById(elementId);
    if (!element) return;

    const totalFrames = (duration / millisecondsPerSecond) * frameRate;
    for (let i = 0; i < totalFrames; i++) {
      //console.log("Capturing frame", i + 1, "of", totalFrames);
      const frame = await toPng(element);
      frames.push(frame);
      await new Promise((resolve) => setTimeout(resolve, captureInterval));
    }

    return frames;
  };

  const createGIF = (frames: string[]) => {
    gifshot.createGIF(
      {
        images: frames,
        gifWidth: GIF_SIZE,
        gifHeight: GIF_SIZE,
        //interval: 1 / 60,
        frameDuration: 1, // Each frame lasts 10ms, making all 60 frames last 600ms or 0.6s
        //numFrames: 60, // 60 frames repeated twice to fill 1 second
        numWorkers: 5,
      },
      function (obj: GifShotResult) {
        if (!obj.error) {
          setDownloadSuccess(true);
          setTimeout(() => {
            setDownloadSuccess(false);
            setIsDownloading(false);
          }, 1000);
          const image = obj.image;
          const animatedImage = document.createElement("img");
          animatedImage.src = image;

          const gifDisplayContainer = document.getElementById(
            "gifDisplayContainer"
          );
          if (gifDisplayContainer) {
            gifDisplayContainer.appendChild(animatedImage);
            gifDisplayContainer.style.display = "block"; // Make the container visible
          }

          const downloadLink = document.createElement("a");
          downloadLink.href = image;
          downloadLink.download = `${words.join("_")}.gif`;
          downloadLink.click();
        }
        setIsDownloading(false);
      }
    );
  };
  return (
    <>
      <Box className="word-container" sx={{ border: "8px solid gold" }}>
        <Box
          id="gifContainer"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            gap: 1,
            paddingY: 4,
            width: `${GIF_SIZE}px`,
            height: `${GIF_SIZE}px`,
            aspectRatio: "1 / 1",
            alignItems: "center",
            background:
              gradientDirection === "toCenter"
                ? `radial-gradient(circle at center, ${backgroundColors[1]}, ${backgroundColors[0]})`
                : `radial-gradient(circle at center, ${backgroundColors[0]}, ${backgroundColors[1]})`,
          }}
        >
          {words.map((word, index) => (
            <Typography
              key={index}
              className="animated-text"
              sx={{
                textAlign: "center",
                fontSize: fontSize,
                fontFamily: `${font}, sans-serif`,
                width: "95%",
                color: `${textColor}`,
                userSelect: "none",
                animation: `${animation} ${ANIMATION_DURATION_S}s infinite`,
              }}
            >
              {word}
            </Typography>
          ))}
        </Box>
      </Box>
      {/* <Box id="gifDisplayContainer" sx={{ display: "none" }}></Box>*/}
      <StyledButton
        variant="contained"
        onClick={async () => {
          handleAddWord();
          const frames =
            (await captureFrames("gifContainer", captureLength, frameRate)) ||
            [];
          createGIF(frames);
        }}
        disabled={isDownloading}
      >
        {isDownloading ? (
          <CircularProgress size={24} />
        ) : downloadSuccess ? (
          <Check style={{ color: "green" }} />
        ) : (
          <Typography>Download</Typography>
        )}
      </StyledButton>
    </>
  );
};

export default WordGIF;
