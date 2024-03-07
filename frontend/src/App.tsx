import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chart from "./pages/Chart";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/words" element={<Chart />} />
    </Routes>
  );
};

export default App;
