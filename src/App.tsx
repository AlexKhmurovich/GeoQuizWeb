import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Flags from "./pages/Flags";
import Capitals from "./pages/Capitals";
import Shapes from "./pages/Shapes";
import Domains from "./pages/Domains";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flags" element={<Flags />} />
            <Route path="/capitals" element={<Capitals />} />
            <Route path="/shapes" element={<Shapes />} />
            <Route path="/domains" element={<Domains />} />
         </Routes>
      </Router>
   );
}

export default App;
