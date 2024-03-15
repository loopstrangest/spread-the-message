import React from "react";
import { Typography } from "@mui/material";
import StyledButton from "./StyledButton";

interface ToggleGIFButtonProps {
  handleToggle: () => void;
  showGIF: boolean;
}

const ToggleGIFButton: React.FC<ToggleGIFButtonProps> = ({
  showGIF,
  handleToggle,
}) => {
  return (
    <StyledButton variant="contained" onClick={() => handleToggle()}>
      <Typography
        style={{
          display: "flex",
          alignItems: "center",
          height: "24px",
        }}
      >
        {showGIF ? "Edit Text" : "Show GIF"}
      </Typography>
    </StyledButton>
  );
};

export default ToggleGIFButton;
