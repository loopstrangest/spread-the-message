import { FC, useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import { calculateFontSize } from "../utilities/calculateFontSize";
import { GIF_SIZE } from "../constants";

interface WordInputProps {
  setInputWord: (value: string, index: number) => void;
  inputWords: string[];
  font: string;
  textColor: string;
  backgroundColors: string[];
  gradientDirection: string;
}

const WordInput: FC<WordInputProps> = ({
  inputWords,
  setInputWord,
  font,
  textColor,
  backgroundColors,
  gradientDirection,
}) => {
  // State hooks for each TextField
  const [inputValue1, setInputValue1] = useState<string>("");
  const [inputValue2, setInputValue2] = useState<string>("");
  const [inputValue3, setInputValue3] = useState<string>("");
  const [fontSize, setFontSize] = useState("36px");

  useEffect(() => {
    setInputValue1(inputWords[0] || "");
    setInputValue2(inputWords[1] || "");
    setInputValue3(inputWords[2] || "");
  }, [inputWords]);

  useEffect(() => {
    setFontSize(calculateFontSize(inputWords));
  }, [inputWords]);

  const updateLocalStorage = () => {
    const values = [inputValue1, inputValue2, inputValue3];
    localStorage.setItem("stm_inputValues", JSON.stringify(values));
  };

  const handleInputChange = (
    value: string,
    setter: (value: string) => void,
    index: number
  ) => {
    const upperValue = value;
    if (isValidInput(upperValue)) {
      setter(upperValue);
      setInputWord(upperValue, index);
    }
  };

  const isValidInput = (input: string) => {
    const hasValidChars = /^[A-Za-z0-9@#'.?!]*$/.test(input);
    const atCount = (input.match(/@/g) || []).length;
    const hashCount = (input.match(/#/g) || []).length;
    const apostropheCount = (input.match(/'/g) || []).length;
    const periodCount = (input.match(/\./g) || []).length;
    const questionMarkCount = (input.match(/\?/g) || []).length;
    const exclamationMarkCount = (input.match(/!/g) || []).length;
    return (
      hasValidChars &&
      atCount <= 1 &&
      hashCount <= 1 &&
      apostropheCount <= 1 &&
      periodCount + questionMarkCount + exclamationMarkCount <= 3
    );
  };

  return (
    <Box className="word-container" sx={{ border: "8px dashed gold" }}>
      <Box
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
        {[setInputValue1, setInputValue2, setInputValue3].map(
          (setter, index) => (
            <TextField
              key={`wordInput${index + 1}`}
              variant="standard"
              value={[inputValue1, inputValue2, inputValue3][index]}
              onChange={(e) => handleInputChange(e.target.value, setter, index)}
              onBlur={updateLocalStorage}
              InputProps={{ disableUnderline: true }}
              inputProps={{
                style: {
                  margin: "auto",
                  textAlign: "center",
                  fontSize: fontSize,
                  fontFamily: `${font}, sans-serif`,
                  width: "95%",
                  color: `${textColor}`,
                },
              }}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default WordInput;
