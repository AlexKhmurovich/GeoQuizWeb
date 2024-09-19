import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Flags from "./pages/Flags";
import Capitals from "./pages/Capitals";
import Shapes from "./pages/Shapes";
import Domains from "./pages/Domains";
import Anthems from "./pages/Anthems";
import Combo from "./pages/Combo";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flags" element={<Flags />} />
            <Route path="/capitals" element={<Capitals />} />
            <Route path="/shapes" element={<Shapes />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/anthems" element={<Anthems />} />
            <Route path="/combo" element={<Combo />} />
         </Routes>
      </Router>
   );
}

export default App;
