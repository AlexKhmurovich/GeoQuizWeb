import { HashRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Flags from "./pages/Flags";
import Capitals from "./pages/Capitals";
import Shapes from "./pages/Shapes";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flags" element={<Flags />} />
            <Route path="/capitals" element={<Capitals />} />
            <Route path="/shapes" element={<Shapes />} />
         </Routes>
      </Router>
   );
}

export default App;
