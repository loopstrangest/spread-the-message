import React from "react";
import { Box } from "@mui/material";
import StyledButton from "./StyledButton";

interface MenuProps {
  showGIF: boolean;
  handleToggle: () => void;
  isDownloading: boolean;
  handleDownload: () => void;
}

const Menu: React.FC<MenuProps> = ({
  showGIF,
  handleToggle,
  isDownloading,
  handleDownload,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
      {showGIF ? (
        <>
          <StyledButton onClick={handleDownload} disabled={isDownloading}>
            Download
          </StyledButton>
          <StyledButton onClick={handleToggle}>Edit Text</StyledButton>
        </>
      ) : (
        <StyledButton onClick={handleToggle}>Show GIF</StyledButton>
      )}
    </Box>
  );
};

export default Menu;
