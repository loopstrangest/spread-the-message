import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import { Box, Button, Container, Typography } from "@mui/material"; // Import MUI components
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";

interface WordCount {
  word: string;
  count: number;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ShowWords = () => {
  const [wordCounts, setWordCounts] = useState<WordCount[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/words`)
      .then((response) => {
        if (response.data && response.data.data) {
          const countsArray: WordCount[] = response.data.data
            .map(({ word, count }: { word: string; count: number }) => ({
              word,
              count,
            }))
            .sort((a: WordCount, b: WordCount) => b.count - a.count)
            .slice(0, 10); // Limiting the array to the top 10 entries
          setWordCounts(countsArray);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const maxWordLength = Math.max(
    ...wordCounts.map((wordCount) => wordCount.word.length)
  );

  return (
    <Container maxWidth="lg">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={2} // Added gap property to give more vertical space between elements
      >
        <Typography variant="h4">Popular Words</Typography>

        {loading ? (
          <Loader />
        ) : (
          <VictoryChart
            height={200}
            domainPadding={0} // Reduced domain padding for more space between bars
            padding={{
              top: 20,
              bottom: 20,
              left: 50 + maxWordLength * 4,
              right: 20,
            }}
            style={{
              parent: {
                width: "95%",
                maxWidth: "800px",
                border: "1px solid #ccc", // Kept border around the chart
                borderRadius: "5px", // Optional: if you want rounded corners
              },
            }}
          >
            <VictoryAxis
              dependentAxis
              tickFormat={() => ""}
              style={{
                axis: { stroke: "transparent", strokeWidth: 1 },
              }}
            />
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: 0,
                  verticalAnchor: "middle",
                  textAnchor: "end",
                  fontSize: 14,
                  padding: 5,
                  fill: "white",
                },
                axis: { stroke: "transparent", strokeWidth: 1 },
              }}
            />
            <VictoryBar
              horizontal
              data={wordCounts.sort((a, b) => a.count - b.count)}
              x="word"
              y="count"
              barRatio={0.5} // Increased bar ratio for bars to be closer together while keeping the same size
              style={{
                data: { fill: "gold" },
              }}
            />
          </VictoryChart>
        )}
        <Button
          variant="contained"
          sx={{ outline: "1px solid white" }}
          onClick={() => navigate("/")}
        >
          <HomeIcon />
        </Button>
      </Box>
    </Container>
  );
};

export default ShowWords;
