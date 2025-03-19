import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
   return (
      <Router>
         <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/single/:modeId" element={<Game isMulti={false} />} />
            <Route path="/multi/:modeId" element={<Game isMulti={true} />} />
         </Routes>
      </Router>
   );
}

export default App;
