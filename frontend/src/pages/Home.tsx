import { useState, useEffect } from "react";
import WordInput from "../components/WordInput";
import WordGIF from "../components/WordGIF";
import AddWordsButton from "../components/ToggleGIFButton";
import axios from "axios";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BarChartIcon from "@mui/icons-material/BarChart";
import StyledButton from "../components/StyledButton";
import { MuiColorInput, MuiColorInputValue } from "mui-color-input";
import { ANIMATION_DURATION_S } from "../constants";
import { ZoomInMap, ZoomOutMap } from "@mui/icons-material";
import { BACKEND_URL } from "../urls";
//import { Redis } from "@upstash/redis";
//import englishWords from "an-array-of-english-words";
type PickerVisibility =
  | "none"
  | "font"
  | "textColor"
  | "backgroundColor"
  | "effect";

const Home = () => {
  const [inputWords, setInputWords] = useState(["", "", ""]);
  const [showGIF, setShowGIF] = useState(true);
  const [activePicker, setActivePicker] = useState<PickerVisibility>("none");
  const [font, setFont] = useState("Roboto");
  const [textColor, setTextColor] = useState<MuiColorInputValue>("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [backgroundColor2, setBackgroundColor2] = useState("#000000");
  const [gradientDirection, setGradientDirection] = useState("toCenter"); // Options: 'toCenter', 'fromCenter'
  const [selectedAnimation, setSelectedAnimation] = useState("fade-in-out");
  const animationEffects = ["fade-in-out", "bounce", "shake", "tada"];
  const fonts = [
    "Abril",
    "Bebas",
    "Caveat",
    "Dancing",
    "Marker",
    "Playfair",
    "Protest",
    "Roboto",
  ];

  const navigate = useNavigate();

  const getButtonStyles = (pickerType: PickerVisibility) => ({
    backgroundColor: activePicker === pickerType ? "black" : "gold",
    color: activePicker === pickerType ? "gold" : "black",
    "&:hover": {
      backgroundColor: activePicker === pickerType ? "black" : "gold",
      color: activePicker === pickerType ? "gold" : "black",
    },
  });

  useEffect(() => {
    const savedValues = JSON.parse(
      localStorage.getItem("stm_inputValues") || '["", "", ""]'
    );
    setInputWords(savedValues);
    const savedFont = localStorage.getItem("stm_font");
    if (savedFont) setFont(savedFont);
    const savedTextColor = localStorage.getItem("stm_textColor");
    if (savedTextColor) setTextColor(savedTextColor);
    const savedBackgroundColor = localStorage.getItem("stm_backgroundColor");
    if (savedBackgroundColor) setBackgroundColor(savedBackgroundColor);
    const savedBackgroundColor2 = localStorage.getItem("stm_backgroundColor2");
    if (savedBackgroundColor2) setBackgroundColor2(savedBackgroundColor2);
    const savedGradientDirection = localStorage.getItem(
      "stm_gradientDirection"
    );
    if (savedGradientDirection) setGradientDirection(savedGradientDirection);
    const savedSelectedAnimation = localStorage.getItem(
      "stm_selectedAnimation"
    );
    if (savedSelectedAnimation) setSelectedAnimation(savedSelectedAnimation);
  }, []);

  useEffect(() => {
    localStorage.setItem("stm_font", font);
  }, [font]);

  useEffect(() => {
    localStorage.setItem("stm_textColor", textColor.toString());
  }, [textColor]);

  useEffect(() => {
    localStorage.setItem("stm_backgroundColor", backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    localStorage.setItem("stm_backgroundColor2", backgroundColor2);
  }, [backgroundColor2]);

  useEffect(() => {
    localStorage.setItem("stm_gradientDirection", gradientDirection);
  }, [gradientDirection]);

  useEffect(() => {
    localStorage.setItem("stm_selectedAnimation", selectedAnimation);
  }, [selectedAnimation]);

  const handleAddWord = () => {
    inputWords.forEach((word) => {
      if (word !== "") {
        const lowercaseWord = word.toLowerCase();
        axios
          .get(`${BACKEND_URL}/words/get-ip`)

          .then((res) => {
            return axios.post(`${BACKEND_URL}/words`, {
              word: lowercaseWord,
              ipAddress: res.data.ip,
            });
          });
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2}
      >
        {showGIF ? (
          <WordGIF
            words={inputWords}
            animation={selectedAnimation}
            font={font}
            textColor={textColor.toString()}
            backgroundColors={[backgroundColor, backgroundColor2]}
            gradientDirection={gradientDirection}
          />
        ) : (
          <WordInput
            inputWords={inputWords}
            setInputWord={(value, index) => {
              setInputWords((current) => {
                const updated = [...current];
                updated[index] = value;
                return updated;
              });
            }}
            font={font}
            textColor={textColor.toString()}
            backgroundColors={[backgroundColor, backgroundColor2]}
            gradientDirection={gradientDirection}
          />
        )}

        <AddWordsButton
          showGIF={showGIF}
          handleAddWord={() => {
            if (!showGIF) {
              handleAddWord();
            }
            setShowGIF(!showGIF);
          }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <StyledButton
            onClick={() =>
              setActivePicker(activePicker === "font" ? "none" : "font")
            }
            sx={getButtonStyles("font")}
          >
            <Typography>Font</Typography>
          </StyledButton>

          <StyledButton
            onClick={() =>
              setActivePicker(
                activePicker === "textColor" ? "none" : "textColor"
              )
            }
            sx={getButtonStyles("textColor")}
          >
            <Typography>Text</Typography>
          </StyledButton>

          <StyledButton
            onClick={() =>
              setActivePicker(
                activePicker === "backgroundColor" ? "none" : "backgroundColor"
              )
            }
            sx={getButtonStyles("backgroundColor")}
          >
            <Typography>Background</Typography>
          </StyledButton>

          <StyledButton
            onClick={() =>
              setActivePicker(activePicker === "effect" ? "none" : "effect")
            }
            sx={getButtonStyles("effect")}
          >
            <Typography>Effect</Typography>
          </StyledButton>
        </Box>
        <Box sx={{ maxWidth: "375px", margin: 0 }}>
          {activePicker === "font" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                width: "inherit",
                overflow: "auto",
              }}
            >
              {fonts.map((font) => (
                <Typography
                  key={font}
                  onClick={() => {
                    setFont(font);
                  }}
                  style={{
                    fontFamily: font,
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "8px",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  {font}
                </Typography>
              ))}
            </Box>
          )}
          {activePicker === "textColor" && (
            <MuiColorInput
              variant="outlined"
              format="hex8"
              sx={{
                width: "150px",
                flexGrow: 1,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFFFFF",
                },
              }}
              value={textColor}
              onChange={(color) => setTextColor(color)}
              inputProps={{ style: { color: "#FFFFFF" } }}
            />
          )}
          {activePicker === "backgroundColor" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MuiColorInput
                variant="outlined"
                format="hex8"
                sx={{
                  width: "150px",
                  flexGrow: 1,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF",
                  },
                }}
                value={backgroundColor}
                onChange={(color) => setBackgroundColor(color)}
                inputProps={{ style: { color: "#FFFFFF" } }}
              />
              <StyledButton
                sx={{
                  height: "34px",
                  minWidth: "40px",
                  padding: "0 !important",
                  mx: 1,
                }}
                onClick={() =>
                  setGradientDirection(
                    gradientDirection === "toCenter" ? "fromCenter" : "toCenter"
                  )
                }
              >
                {gradientDirection === "toCenter" ? (
                  <ZoomInMap />
                ) : (
                  <ZoomOutMap />
                )}
              </StyledButton>
              <MuiColorInput
                variant="outlined"
                format="hex8"
                sx={{
                  width: "150px",
                  flexGrow: 1,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#FFFFFF",
                  },
                }}
                value={backgroundColor2}
                onChange={(color) => setBackgroundColor2(color)}
                inputProps={{ style: { color: "#FFFFFF" } }}
              />
            </Box>
          )}
          {activePicker === "effect" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                width: `350px`,
                overflow: "none",
              }}
            >
              {animationEffects.map((effect) => (
                <Typography
                  key={effect}
                  onClick={() => {
                    setSelectedAnimation(effect);
                  }}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "8px",
                    animation: `${effect} ${ANIMATION_DURATION_S}s infinite`,
                    color: "white",
                    userSelect: "none",
                  }}
                >
                  {effect.charAt(0).toUpperCase() + effect.slice(1)}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          sx={{ outline: "1px solid white" }}
          onClick={() => navigate("/words")}
        >
          <BarChartIcon />
        </Button>
      </Box>
    </Container>
  );
};

export default Home;