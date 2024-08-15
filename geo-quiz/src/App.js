import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import './App.css';
import Home from "./pages/Home.js"
import Flags from "./pages/Flags.js";
import Capitals from "./pages/Capitals.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flags" element={<Flags />} />
        <Route path="/capitals" element={<Capitals />} />
      </Routes>
  </Router>
  );
}

export default App;
