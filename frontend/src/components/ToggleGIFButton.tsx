import React from "react";
import { Typography } from "@mui/material";
import StyledButton from "./StyledButton";

interface AddWordButtonProps {
  handleToggle: () => void;
  showGIF: boolean;
}

const AddWordButton: React.FC<AddWordButtonProps> = ({
  showGIF,
  handleToggle,
}) => {
  return (
    <StyledButton variant="contained" onClick={() => handleToggle()}>
      <Typography
        style={{
          paddingTop: "4px",
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        {showGIF ? "Edit Text" : "Show GIF"}
      </Typography>
    </StyledButton>
  );
};

export default AddWordButton;
