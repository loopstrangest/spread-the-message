import React from "react";
import { Typography } from "@mui/material";
import StyledButton from "./StyledButton";

interface ToggleGIFButtonProps {
  handleToggle: () => void;
  showGIF: boolean;
  isDownloading?: boolean;
}

const ToggleGIFButton: React.FC<ToggleGIFButtonProps> = ({
  showGIF,
  handleToggle,
  isDownloading,
}) => {
  return (
    <StyledButton
      variant="contained"
      onClick={() => handleToggle()}
      disabled={isDownloading}
      sx={{
        ...(isDownloading
          ? { backgroundColor: "gray !important", color: "white" }
          : {}),
      }}
    >
      <Typography
        style={{
          display: "flex",
          alignItems: "center",
          height: "24px",
          ...(isDownloading ? { color: "white" } : {}),
        }}
      >
        {showGIF ? "Edit Text" : "Show GIF"}
      </Typography>
    </StyledButton>
  );
};

export default ToggleGIFButton;
