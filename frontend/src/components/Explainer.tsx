import React, { useState } from "react";
import { Modal, IconButton, Typography, Box } from "@mui/material";
import { QuestionMark, Twitter, Home, Mail, Close } from "@mui/icons-material";
import bmcImage from "../images/bmc.png";

const Explainer: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  return (
    <>
      <IconButton
        aria-label="open rules"
        component="span"
        onClick={handleOpen}
        style={{
          color: "white",
          opacity: 0.5,
          position: "absolute",
          top: 0,
          right: 8,
        }}
      >
        <QuestionMark sx={{ fontSize: "36px" }} />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(80%, 400px)",
            maxHeight: "90%",
            overflowY: "auto",
            bgcolor: "rgba(29, 161, 242, 1)",
            borderRadius: "8px",
            border: "1px solid white",
            boxShadow: "0px 0px 32px white",
            p: 4,
            color: "white",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 5px grey",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "white",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#b3b3b3",
            },
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "white",
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{ fontWeight: "bold", fontStyle: "italic" }}
          >
            Spread The Message
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Make custom GIFs!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            The GIF View (solid border) displays the GIF in action. Click
            "Download" to download the GIF.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Click the GIF or "Edit Text" to move to Edit View (dashed border),
            where you can click each of the three words to change them.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            In both views, you can adjust the font, colors, and text effect. The
            color selectors allow for color names like "red" or "lightblue", in
            addition to hex codes.
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Click the chart icon to see a chart of the most popular words among
            all users.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <IconButton
              aria-label="twitter"
              component="span"
              onClick={() =>
                window.open("https://twitter.com/strangestloop", "_blank")
              }
            >
              <Twitter sx={{ fontSize: "48px", color: "white" }} />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="home"
              component="span"
              onClick={() => window.open("https://strangestloop.io", "_blank")}
            >
              <Home sx={{ fontSize: "48px", color: "white" }} />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="mail"
              component="span"
              onClick={() =>
                window.open("mailto:loopstrangest@gmail.com", "_blank")
              }
            >
              <Mail sx={{ fontSize: "48px", color: "white" }} />
            </IconButton>
            <IconButton
              aria-label="buy-me-a-coffee"
              component="span"
              onClick={() =>
                window.open("https://www.buymeacoffee.com/loopy", "_blank")
              }
              sx={{ mx: 0.5 }}
            >
              <img
                src={bmcImage}
                alt="Buy Me A Coffee"
                style={{ width: "28px" }}
              />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Explainer;
