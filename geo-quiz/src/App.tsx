import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Flags from "./pages/Flags";
import Capitals from "./pages/Capitals";

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
